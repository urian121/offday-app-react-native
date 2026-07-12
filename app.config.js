const appJson = require("./app.json");

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      eas: {
        projectId: "df39925d-ccb0-4162-85a1-66397db65640",
      },
    },
  },
};
