module FlightsHelper
    
    def leg_heading_id(id)
        "heading_#{id}"
    end
    
    def leg_collapse_id(id)
        "collapse_#{id}"
    end
    
    def leg_panel_class(status)
       panel_class = "panel-"
       case status
            when "ARRIVED"
                panel_class += "success"
            when "DEPARTED"
                panel_class += "info"
            when "DELAYED"
                panel_class += "warning"
            when "ONTIME"
                panel_class += "primary"
            when "CANCELED"
                panel_class += "danger"
            else
                panel_class += "info"
        end
        panel_class
    end
    
end
