# config/routes.rb
Rails.application.routes.draw do
  resources :todos do
    resources :items
  end
end

Rails.application.routes.draw do
	resources :boggles do
	end
end