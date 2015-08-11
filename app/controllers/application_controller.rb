class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_filter :tracker
  
  # Convert array of params to a symbol hash
  def params_to_symbol_hash
    params.inject({}){|data,(key, value)| data[key.to_sym] = value; data}
  end
  
  private
    def tracker
        @tracker ||= JetBluePlaneTracker::Tracker.new
    end
end
