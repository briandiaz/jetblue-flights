class FlightsController < ApplicationController
  before_filter :set_flights, only: [:index]
  
  def index
    
  end
  
  
  private
    
    def set_flights
      if valid_params?
        @flights = @tracker.flight_status(params_to_symbol_hash)
      else
        params[:origin] = "STI" 
        params[:destination] = "SFO"
        params[:date] = DateTime.now.strftime("%Y-%m-%d")
        @flights = @tracker.flight_status(origin: "STI", destination: "AUS", date: DateTime.now.strftime("%Y-%m-%d"))
      end
      @airports = JetBluePlaneTracker::Airport.all
    end
    
    def valid_params?
      (params.has_key?("date") and params.has_key?("flight")) or (params.has_key?('origin') and params.has_key?("destination"))
    end
    
  
end
