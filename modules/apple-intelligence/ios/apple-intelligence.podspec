require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'expo-module.config.json')))

Pod::Spec.new do |s|
  s.name           = 'apple-intelligence'
  s.version        = '1.0.0'
  s.summary        = 'Apple Intelligence integration for nihonGO'
  s.description    = 'Expo module providing Apple Intelligence (FoundationModels) support'
  s.author         = 'nihonGO'
  s.homepage       = 'https://github.com/jumbomochi/nihonGO'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'

  s.weak_frameworks = 'FoundationModels'
end
