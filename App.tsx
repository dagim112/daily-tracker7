{
  "expo": {
    "name": "Daily Tracker",
    "slug": "daily-tracker",
    "scheme": "dailytracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/icon.png",
          "color": "#1E90FF"
        }
      ]
    ],
    "android": {
      "package": "com.example.dailytracker",
      "permissions": ["NOTIFICATIONS"]
    },
    "ios": {
      "supportsTablet": true
    }
  }
}
