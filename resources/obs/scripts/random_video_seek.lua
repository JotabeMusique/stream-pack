obs = obslua

function script_description()
    return "A script to randomize seek time in Media Source at start up"
end

source_name = ""

function script_properties()
    local props = obs.obs_properties_create()

    local sources = obs.obs_enum_sources()
    if sources ~= nil then
        source_list = obs.obs_properties_add_list(props, "source", "Media Source", obs.OBS_COMBO_TYPE_EDITABLE, obs.OBS_COMBO_FORMAT_STRING)
        for _, source in ipairs(sources) do
            source_id = obs.obs_source_get_id(source)
			if source_id == "ffmpeg_source" or source_id == "vlc_source" then
				source_name = obs.obs_source_get_name(source)
				obs.obs_property_list_add_string(source_list, source_name, source_name)
			end
        end
    end

    obs.source_list_release(sources)

    obs.obs_properties_add_bool(props, "active", "Active")
    
    return props
end

function script_update(settings)
    obs.script_log(obs.LOG_INFO, "script update")
    source_name = obs.obs_data_get_string(settings, "source")
	
	if active ~= obs.obs_data_get_bool(settings, "active") then
        active = obs.obs_data_get_bool(settings, "active")
    
		if active then
			randomize_seek()
		end
	end 
end

function randomize_seek() 
    obs.script_log(obs.LOG_INFO, "source name: "..source_name)
    local source = obs.obs_get_source_by_name(source_name)

    if source ~= nil then
        local duration = obs.obs_source_media_get_duration(source)
        local new_time = math.ceil(math.random() * duration)
        obs.script_log(obs.LOG_INFO, "duration: "..duration.." ms")
        obs.script_log(obs.LOG_INFO, "new time: "..new_time.." ms")
        obs.script_log(obs.LOG_INFO, source_name)
        obs.obs_source_media_set_time(source, new_time)
        obs.obs_source_release(source)
    else
        obs.script_log(obs.LOG_INFO, "cannot get source: "..source_name)
    end
end

function start_callback(event)
    if event == obs.OBS_FRONTEND_EVENT_FINISHED_LOADING then
        obs.remove_current_callback()
        math.randomseed(os.time())
        randomize_seek()
    end
end

function script_load()
    obs.script_log(obs.LOG_INFO, "script load")
    obs.obs_frontend_add_event_callback(start_callback)
end