class Boggle < ApplicationRecord
	#validation
	validates :name, presence: true,length: {minimum: 5}
	validates_presence_of :name, :score, :identifier
end
