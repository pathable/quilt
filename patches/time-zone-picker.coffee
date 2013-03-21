define ->

  Quilt.attributes.timezonePicker = (el, options) ->
    options = {el, @model}
    new TimeZonePicker(options)

  class TimeZonePicker extends Quilt.View

    tagName: 'select'

    zones: {"USA & Canada":"optgroup", "Pacific Time": "America/Los_Angeles", "Mountain Time": "America/Denver", "Central Time": "America/Chicago",  "Eastern Time": "America/New_York", "Worldwide":"optgroup", "International Date Line West": "Pacific/Midway", "Midway Island": "Pacific/Midway", "Samoa": "Pacific/Pago_Pago", "Hawaii": "Pacific/Honolulu", "Alaska": "America/Juneau", "Tijuana": "America/Tijuana", "Arizona": "America/Phoenix", "Chihuahua": "America/Chihuahua", "Mazatlan": "America/Mazatlan", "Saskatchewan": "America/Regina", "Guadalajara": "America/Mexico_City", "Mexico City": "America/Mexico_City", "Monterrey": "America/Monterrey", "Central America": "America/Guatemala", "Indiana (East)": "America/Indiana/Indianapolis", "Bogota": "America/Bogota", "Lima": "America/Lima", "Quito": "America/Lima", "Atlantic Time (Canada)": "America/Halifax", "Caracas": "America/Caracas", "La Paz": "America/La_Paz", "Santiago": "America/Santiago", "Newfoundland": "America/St_Johns", "Brasilia": "America/Sao_Paulo", "Buenos Aires": "America/Argentina/Buenos_Aires", "Georgetown": "America/Guyana", "Greenland": "America/Godthab", "Mid-Atlantic": "Atlantic/South_Georgia", "Azores": "Atlantic/Azores", "Cape Verde Is.": "Atlantic/Cape_Verde", "Dublin": "Europe/Dublin", "Edinburgh": "Europe/London", "Lisbon": "Europe/Lisbon", "London": "Europe/London", "Casablanca": "Africa/Casablanca", "Monrovia": "Africa/Monrovia", "UTC": "Etc/UTC", "Belgrade": "Europe/Belgrade", "Bratislava": "Europe/Bratislava", "Budapest": "Europe/Budapest", "Ljubljana": "Europe/Ljubljana", "Prague": "Europe/Prague", "Sarajevo": "Europe/Sarajevo", "Skopje": "Europe/Skopje", "Warsaw": "Europe/Warsaw", "Zagreb": "Europe/Zagreb", "Brussels": "Europe/Brussels", "Copenhagen": "Europe/Copenhagen", "Madrid": "Europe/Madrid", "Paris": "Europe/Paris", "Amsterdam": "Europe/Amsterdam", "Berlin": "Europe/Berlin", "Bern": "Europe/Berlin", "Rome": "Europe/Rome", "Stockholm": "Europe/Stockholm", "Vienna": "Europe/Vienna", "West Central Africa": "Africa/Algiers", "Bucharest": "Europe/Bucharest", "Cairo": "Africa/Cairo", "Helsinki": "Europe/Helsinki", "Kyiv": "Europe/Kiev", "Riga": "Europe/Riga", "Sofia": "Europe/Sofia", "Tallinn": "Europe/Tallinn", "Vilnius": "Europe/Vilnius", "Athens": "Europe/Athens", "Istanbul": "Europe/Istanbul", "Minsk": "Europe/Minsk", "Jerusalem": "Asia/Jerusalem", "Harare": "Africa/Harare", "Pretoria": "Africa/Johannesburg", "Moscow": "Europe/Moscow", "St. Petersburg": "Europe/Moscow", "Volgograd": "Europe/Moscow", "Kuwait": "Asia/Kuwait", "Riyadh": "Asia/Riyadh", "Nairobi": "Africa/Nairobi", "Baghdad": "Asia/Baghdad", "Tehran": "Asia/Tehran", "Abu Dhabi": "Asia/Muscat", "Muscat": "Asia/Muscat", "Baku": "Asia/Baku", "Tbilisi": "Asia/Tbilisi", "Yerevan": "Asia/Yerevan", "Kabul": "Asia/Kabul", "Ekaterinburg": "Asia/Yekaterinburg", "Islamabad": "Asia/Karachi", "Karachi": "Asia/Karachi", "Tashkent": "Asia/Tashkent", "Chennai": "Asia/Kolkata", "Kolkata": "Asia/Kolkata", "Mumbai": "Asia/Kolkata", "New Delhi": "Asia/Kolkata", "Kathmandu": "Asia/Kathmandu", "Astana": "Asia/Dhaka", "Dhaka": "Asia/Dhaka", "Sri Jayawardenepura": "Asia/Colombo", "Almaty": "Asia/Almaty", "Novosibirsk": "Asia/Novosibirsk", "Rangoon": "Asia/Rangoon", "Bangkok": "Asia/Bangkok", "Hanoi": "Asia/Bangkok", "Jakarta": "Asia/Jakarta", "Krasnoyarsk": "Asia/Krasnoyarsk", "Beijing": "Asia/Shanghai", "Chongqing": "Asia/Chongqing", "Hong Kong": "Asia/Hong_Kong", "Urumqi": "Asia/Urumqi", "Kuala Lumpur": "Asia/Kuala_Lumpur", "Singapore": "Asia/Singapore", "Taipei": "Asia/Taipei", "Perth": "Australia/Perth", "Irkutsk": "Asia/Irkutsk", "Ulaan Bataar": "Asia/Ulaanbaatar", "Seoul": "Asia/Seoul", "Osaka": "Asia/Tokyo", "Sapporo": "Asia/Tokyo", "Tokyo": "Asia/Tokyo", "Yakutsk": "Asia/Yakutsk", "Darwin": "Australia/Darwin", "Adelaide": "Australia/Adelaide", "Canberra": "Australia/Melbourne", "Melbourne": "Australia/Melbourne", "Sydney": "Australia/Sydney", "Brisbane": "Australia/Brisbane", "Hobart": "Australia/Hobart", "Vladivostok": "Asia/Vladivostok", "Guam": "Pacific/Guam", "Port Moresby": "Pacific/Port_Moresby", "Magadan": "Asia/Magadan", "Solomon Is.": "Asia/Magadan", "New Caledonia": "Pacific/Noumea", "Fiji": "Pacific/Fiji", "Kamchatka": "Asia/Kamchatka", "Marshall Is.": "Pacific/Majuro", "Auckland": "Pacific/Auckland", "Wellington": "Pacific/Auckland", "Nuku'alofa": "Pacific/Tongatapu"}

    initialize: (options) ->
      {@model} = options
      @attr = @$el.attr('name')
      @model?.on('change', @_change, @)

    render: ->
      @$el.empty().html @_zones()
      @$el.val @model.get(@attr)
      @

    _zones: ->
      _.map @zones, (value, label)->
        return "<optgroup label=\"#{label}\">" if value.toLowerCase() is 'optgroup'
        "<option value=\"#{value}\">#{label}</option>"
      .join(' ')

    _change: ->
      @render() if @model?.hasChanged(@attr or 'id')