export default defineI18nConfig(() => ({
  pluralRules: {
    cs: function (choice) {
      if (choice === 0) {
        return 0
      }

      if (choice === 1) {
        return 1
      }

      if (choice >= 2 && choice <= 4) {
        return 2
      }

      return 3
    },
  },
}))
