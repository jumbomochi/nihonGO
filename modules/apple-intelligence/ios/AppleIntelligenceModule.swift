import ExpoModulesCore
import Foundation

#if canImport(FoundationModels)
import FoundationModels
#endif

public class AppleIntelligenceModule: Module {
  #if canImport(FoundationModels)
  @available(iOS 26.0, *)
  private var session: LanguageModelSession?
  #endif

  public func definition() -> ModuleDefinition {
    Name("AppleIntelligence")

    // Check if Apple Intelligence is available on this device
    AsyncFunction("isAvailable") { () -> Bool in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        let availability = SystemLanguageModel.default.availability
        return availability == .available
      }
      #endif
      return false
    }

    // Get detailed availability status
    AsyncFunction("getAvailabilityStatus") { () -> String in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        let availability = SystemLanguageModel.default.availability
        switch availability {
        case .available:
          return "available"
        case .unavailable(.deviceNotEligible):
          return "device_not_eligible"
        case .unavailable(.appleIntelligenceNotEnabled):
          return "not_enabled"
        case .unavailable(.modelNotReady):
          return "model_not_ready"
        case .unavailable(_):
          return "unavailable"
        @unknown default:
          return "unknown"
        }
      }
      #endif
      return "not_supported"
    }

    // Start a new session with a system prompt
    AsyncFunction("createSession") { (systemPrompt: String) -> Bool in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        let instructions = Instructions(systemPrompt)
        self.session = LanguageModelSession(instructions: instructions)
        return true
      }
      #endif
      return false
    }

    // Send a message and get a response
    AsyncFunction("sendMessage") { (message: String) -> String in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        guard let session = self.session else {
          throw NSError(
            domain: "AppleIntelligence",
            code: 1,
            userInfo: [NSLocalizedDescriptionKey: "No active session. Call createSession first."]
          )
        }

        do {
          let response = try await session.respond(to: message)
          return response.content
        } catch let error as LanguageModelSession.GenerationError {
          switch error {
          case .guardrailViolation:
            throw NSError(
              domain: "AppleIntelligence",
              code: 2,
              userInfo: [NSLocalizedDescriptionKey: "The request was blocked by content safety filters."]
            )
          case .exceededContextWindowSize:
            // Reset session and retry
            let instructions = session.instructions
            self.session = LanguageModelSession(instructions: instructions)
            let retryResponse = try await self.session!.respond(to: message)
            return retryResponse.content
          @unknown default:
            throw NSError(
              domain: "AppleIntelligence",
              code: 3,
              userInfo: [NSLocalizedDescriptionKey: "Generation failed: \(error.localizedDescription)"]
            )
          }
        }
      }
      #endif
      throw NSError(
        domain: "AppleIntelligence",
        code: 0,
        userInfo: [NSLocalizedDescriptionKey: "Apple Intelligence is not available on this device."]
      )
    }

    // Reset the current session
    AsyncFunction("resetSession") { () -> Bool in
      #if canImport(FoundationModels)
      if #available(iOS 26.0, *) {
        if let currentSession = self.session {
          let instructions = currentSession.instructions
          self.session = LanguageModelSession(instructions: instructions)
          return true
        }
      }
      #endif
      return false
    }
  }
}
