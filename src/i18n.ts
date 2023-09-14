import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
              translations: {
                "Email": "Email",
                "Password": "Password",
                "Money":"Money",
                "Matters":"Matters",
                "Login":"Login"
              }
            },
            te: {
              translations: {
                "Email": "ఇమెయిల్",
                "Password": "పాస్వర్డ్",
                "Money":"మనీ",
                "Matters":"మేటర్స్",
                "Login":"ప్రవేశించండి"
              }
            }
          },
          fallbackLng: "en",
          lng:"te",
          debug: true,
          ns: ["translations"],
          defaultNS: "translations",
      
          keySeparator: false, // we use content as keys
          interpolation: {
            escapeValue: false
          }
    })

export default i18n