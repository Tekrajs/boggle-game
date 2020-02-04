class BogglesController < ApplicationController
	before_action :set_boggle , only: [:show, :update, :destroy]

	# GET /boggles
	def index
		@boggles = Boggle.order(score: :desc).first(5)
		json_response(@boggles)
	end

	def show
		json_response(@boggle)
	end

	# POST /boggles
    def create
       @boggle = Boggle.create!(boggle_params)
       json_response(@boggle, :created)
    end

    # PUT /boggles/:boggle_id
    def update
       @boggle.update(boggle_params)
       json_response(Boggle.order(:score).last(5))
    end

    # DELETE /boggles/:boggle_id
    def destroy
       @boggle.destroy
       json_response(Boggle.order(:score).last(5))
    end

    private

	def boggle_params
       # whitelist params
       params.permit(:id, :name, :score, :identifier)
    end


	def set_boggle
		@boggle = Boggle.find(params[:id])
	end
end
