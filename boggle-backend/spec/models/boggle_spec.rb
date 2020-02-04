# spec/models/boggle_spec.rb
require 'rails_helper'

# Test suite for the Item model
RSpec.describe Boggle, type: :model do
  # Validation test
  # ensure column name is present before saving
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:score) }
  it { should validate_presence_of(:identifier) }
end