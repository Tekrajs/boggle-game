class Todo < ApplicationRecord

	#model association
	has_many :items, dependent: :destroy


	#validation

	validates_presence_of :title, :created_by
end
