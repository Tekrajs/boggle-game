# spec/requests/boggles_spec.rb
require 'rails_helper'

RSpec.describe 'Boggles API' do
  # Initialize the test data
  let!(:boggles) { create_list(:boggle, 7) }
  let(:boggle_id) { boggles.first.id }

  # Test suite for GET /boggles/:boggle_id/
  describe 'GET /boggles/:boggle_id' do
    before { get "/boggles/#{boggle_id}" }

    context 'when boggle exists' do
      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end

      it 'returns all boggle boggles' do
        expect(json.size).to eq(6)
      end
    end

    context 'when boggle does not exist' do
      let(:boggle_id) { 0 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Boggle/)
      end
    end
  end

  # Test suite for POST /boggles
  describe 'POST /boggles' do
    # valid payload
    let(:valid_attributes) { { name: 'Visit Narnia', score: 20, identifier: 'dfkjdjsbf34364cfedksb' } }

    context 'when the request is valid' do
      before { post '/boggles', params: valid_attributes }

      it 'creates a todo' do
        expect(json['name']).to eq('Visit Narnia')
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(201)
      end
    end

    context 'when the request is invalid' do
      before { post '/boggles', params: { name:'Visit Narnia', score: 56 } }

      it 'returns status code 422' do
        expect(response).to have_http_status(422)
      end

      it 'returns a validation failure message' do
        expect(response.body)
          .to match(/Validation failed: Identifier can't be blank/)
      end
    end
  end

  # Test suite for PUT /boggles/:id
  describe 'PUT /boggles/:id' do
    let(:valid_attributes) { { name: 'Visit Narnia', score: 20, identifier: 'dfkjdjsbf34364cfedksb' } }

    context 'when the record exists' do
      before { put "/boggles/#{boggle_id}", params: valid_attributes }

      it 'updates the record' do
        expect(response.body).to be_empty
      end

      it 'returns status code 204' do
        expect(response).to have_http_status(204)
      end
    end
  end



  # Test suite for DELETE /boggles/:id
  describe 'DELETE /boggles/:id' do
    before { delete "/boggles/#{boggle_id}" }

    it 'returns status code 204' do
      expect(response).to have_http_status(204)
    end
  end
end