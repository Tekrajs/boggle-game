#spec/factories/boggles.rb
FactoryBot.define do
	factory :boggle do
		name { Faker::Lorem.word }
		score { Faker::Number.number(digits:5) }
		identifier { Faker::String.random(length:32) }
	end
end