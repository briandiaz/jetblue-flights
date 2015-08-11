Rails.application.routes.draw do
  
  root "flights#index"
  
  resources :flights, :except => [:destroy, :update, :edit, :new, :create]
  
end
