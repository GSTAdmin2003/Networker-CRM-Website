import { Lang } from '@/lib/i18n'

export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalPage {
  eyebrow: string
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

const LEGAL_ENTITY = 'შპს ნეთვორქერ სი არ ემ (LLC Networker CRM)'
const LEGAL_ENTITY_EN = 'LLC Networker CRM'
const LEGAL_ID = '404818293'
const CONTACT_EMAIL = 'hello@networkercrm.ge'

export const ABOUT_CONTENT: Record<Lang, LegalPage> = {
  en: {
    eyebrow: 'Company',
    title: 'About Networker',
    updated: '',
    intro:
      'Networker is built by three people who spent years running the exact kind of sales operation this product replaces — spreadsheets, WhatsApp on personal phones, and a call log nobody trusted.',
    sections: [
      {
        heading: 'What we do',
        body: [
          'Networker is an all-in-one CRM for Georgian sales teams: built-in Georgian telephony, AI-assisted call analysis, a shared WhatsApp inbox, and Meta (Facebook/Instagram) lead capture, in one platform rather than four disconnected tools.',
          'We built it for a specific gap: no product on the market — local or international — was designed around how a Georgian SMB sales team actually works, in the language its reps actually speak.',
        ],
      },
      {
        heading: 'Our team',
        body: [
          'Tsotne Tsintsadze, Chief Commercial Officer — a decade running sales operations across five concurrent businesses (construction, accounting, surveillance, marketing, consulting). Owns go-to-market, beta relationships, and revenue.',
          'Davit Shubitidze, Chief Technology Officer — certified Odoo partner; built and deployed ERP systems at three Georgian companies, including 50,000+ lines of custom modules on Odoo 18 for heavy industry. Owns product and engineering.',
          'Levan Khelashvili, Senior Developer / DevOps — full-stack engineer, published academic researcher, currently holds a staff engineering role at a regional tech company. Owns infrastructure and platform reliability.',
        ],
      },
      {
        heading: 'Where we are',
        body: ['Tbilisi, Georgia. We are onboarding a small first cohort of Georgian SMB sales teams.'],
      },
      {
        heading: 'Legal information',
        body: [
          `Operated by ${LEGAL_ENTITY_EN} (${LEGAL_ENTITY}), registration ID ${LEGAL_ID}, Tbilisi, Georgia.`,
          `Contact: ${CONTACT_EMAIL}`,
        ],
      },
    ],
  },
  ka: {
    eyebrow: 'კომპანია',
    title: 'ჩვენ შესახებ',
    updated: '',
    intro:
      'Networker-ს აშენებს სამი ადამიანი, რომლებმაც წლები გაატარეს ზუსტად იმ ტიპის გაყიდვების ოპერაციის მართვაში, რომელსაც ეს პროდუქტი ცვლის — ცხრილები, WhatsApp პირად ტელეფონებზე და ზარების ჟურნალი, რომელსაც არავინ ენდობოდა.',
    sections: [
      {
        heading: 'რას ვაკეთებთ',
        body: [
          'Networker არის ყოვლისმომცველი CRM ქართული გაყიდვების გუნდებისთვის: ჩაშენებული ქართული ტელეფონია, AI-ით მხარდაჭერილი ზარების ანალიზი, გაზიარებული WhatsApp ინბოქსი და Meta (Facebook/Instagram) ლიდების მიღება — ერთ პლატფორმაში, ოთხი გათიშული ინსტრუმენტის ნაცვლად.',
          'ჩვენ ავაშენეთ ეს კონკრეტული ხარვეზისთვის: ბაზარზე არცერთი პროდუქტი — ადგილობრივი თუ საერთაშორისო — არ იყო შექმნილი იმის მიხედვით, თუ როგორ მუშაობს რეალურად ქართული მცირე და საშუალო ბიზნესის გაყიდვების გუნდი, იმ ენაზე, რომელზეც მისი წარმომადგენლები რეალურად საუბრობენ.',
        ],
      },
      {
        heading: 'ჩვენი გუნდი',
        body: [
          'წოტნე წინწაძე, კომერციული დირექტორი — ათწლიანი გამოცდილება გაყიდვების ოპერაციების მართვაში ხუთ პარალელურ ბიზნესში (მშენებლობა, ბუღალტერია, ვიდეო-მეთვალყურეობა, მარკეტინგი, კონსალტინგი). ევალება ბაზარზე გატანა, ბეტა ურთიერთობები და შემოსავლის ნაკადი.',
          'დავით შუბითიძე, ტექნიკური დირექტორი — სერტიფიცირებული Odoo პარტნიორი. ააშენა და დანერგა ERP სისტემები სამ ქართულ კომპანიაში, მათ შორის 50,000+ სტრიქონი მორგებული მოდულები Odoo 18-ზე მძიმე მრეწველობისთვის. ევალება პროდუქტი და ინჟინერია.',
          'ლევან ხელაშვილი, უფროსი დეველოპერი / DevOps — Full-stack ინჟინერი, გამოქვეყნებული აკადემიური მკვლევარი, ამჟამად იკავებს staff ინჟინრის პოზიციას რეგიონულ ტექნოლოგიურ კომპანიაში. ევალება ინფრასტრუქტურა და პლატფორმის საიმედოობა.',
        ],
      },
      {
        heading: 'სად ვართ',
        body: ['თბილისი, საქართველო. ამჟამად ვაწყობთ ქართული მცირე და საშუალო ბიზნესის გაყიდვების გუნდების პირველ, მცირე ჯგუფს.'],
      },
      {
        heading: 'იურიდიული ინფორმაცია',
        body: [
          `ოპერირებას ახორციელებს ${LEGAL_ENTITY}, საიდენტიფიკაციო ნომერი ${LEGAL_ID}, თბილისი, საქართველო.`,
          `კონტაქტი: ${CONTACT_EMAIL}`,
        ],
      },
    ],
  },
}

export const PRIVACY_CONTENT: Record<Lang, LegalPage> = {
  en: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated: September 2026',
    intro:
      `This policy explains what ${LEGAL_ENTITY_EN} ("Networker", "we", "us") collects when you use the Networker CRM platform (the "Service"), why, and what control you have over it. It covers both this marketing site and the CRM application itself.`,
    sections: [
      {
        heading: '1. Who this applies to',
        body: [
          'This policy covers two groups: visitors to this website, and users of the Networker CRM platform operated on behalf of a subscribing business ("Customer"). If you are a customer of one of our Customers (for example, someone who messages a Networker CRM user on WhatsApp, or calls their number), see section 6 for how your data is handled.',
        ],
      },
      {
        heading: '2. Data we collect',
        body: [
          'Account and contact data: name, work email, phone number, company name and registration ID, and role, provided when you request access, contact us, or are added as a user by a Customer.',
          'Call data: call metadata (time, duration, direction), call recordings, and AI-generated transcripts and summaries, for calls made or received through the Service.',
          'Messaging data: WhatsApp Business messages sent and received through the Service, connected via the Meta Cloud API, and any Facebook/Instagram lead-form submissions captured through Meta lead ads.',
          'CRM records: contact, company, and lead data that a Customer\'s team enters or imports into the platform (names, phone numbers, emails, deal notes, and similar).',
          'Usage and device data: pages visited, browser type, and approximate location (from IP address), collected via cookies and analytics tooling on this website.',
        ],
      },
      {
        heading: '3. How we use it',
        body: [
          'To provide the Service: route calls, deliver and store WhatsApp messages, capture leads, and maintain each Customer\'s CRM records.',
          'To process call and meeting transcripts with AI models (see section 4) so the platform can summarize a call, suggest a follow-up, or draft a message — always reviewable, and in most flows editable or requiring confirmation, by the Customer\'s own staff.',
          'To operate, secure, and improve the platform, including diagnosing issues and preventing abuse.',
          'To communicate with you about your account, requested access, or support requests.',
        ],
      },
      {
        heading: '4. AI processing',
        body: [
          'Call and meeting transcripts, and select CRM context needed to act on them, are sent to third-party AI providers (currently Anthropic and/or Google, depending on platform configuration) to generate summaries, suggested next steps, and translations. These providers process the data solely to return a response to that request; we do not permit them to use Customer data to train their own models.',
          'AI-suggested actions (such as creating a follow-up task or sending a document) are logged and, depending on the Customer\'s configuration, require a human to confirm before anything is sent to a real contact.',
        ],
      },
      {
        heading: '5. Who we share data with',
        body: [
          'Sub-processors that help us run the Service: our cloud hosting provider, Meta Platforms (for WhatsApp Business API and Meta lead ads integration), the AI providers described in section 4, and our email/SMTP provider.',
          'We do not sell personal data, and we do not share Customer data with third parties for their own marketing purposes.',
          'We may disclose data if required by law, or to protect the rights, safety, or property of Networker, our Customers, or others.',
        ],
      },
      {
        heading: '6. If you contacted one of our Customers',
        body: [
          'If you called, messaged, or submitted a lead form to a business that uses Networker, your data (message content, call recording, contact details) is controlled by that business, not by us — we process it on their behalf, under their instructions, as their data processor. Requests to access or delete that data should go to the business you contacted; we support them in fulfilling such requests.',
        ],
      },
      {
        heading: '7. Data retention',
        body: [
          'We retain Customer account and CRM data for as long as the Customer\'s subscription is active, plus a limited period after termination to allow data export, unless a shorter period is agreed or a longer period is required by law.',
          'Call recordings and transcripts are retained per the Customer\'s own configured retention settings.',
        ],
      },
      {
        heading: '8. Security',
        body: [
          'Sensitive credentials and secrets are encrypted at rest. Each Customer\'s data is logically isolated from every other Customer\'s data at the database level. Access to Customer data by our own staff is limited to what is needed for support and platform operation, and is logged.',
        ],
      },
      {
        heading: '9. Your rights',
        body: [
          'Depending on your relationship to us, you may have the right to access, correct, export, or request deletion of your personal data. To exercise these rights, contact us at the address below; if your data was collected on behalf of one of our Customers, we may direct your request to them.',
        ],
      },
      {
        heading: '10. Cookies and analytics',
        body: [
          'This website uses cookies and a privacy-conscious analytics tool to understand how visitors use the site and to improve it. You can control cookies through your browser settings.',
        ],
      },
      {
        heading: '11. Children',
        body: ['The Service is intended for business use and is not directed at, or knowingly used by, children.'],
      },
      {
        heading: '12. Changes to this policy',
        body: ['We will update this page when our practices change, and update the date at the top of this page accordingly.'],
      },
      {
        heading: '13. Contact us',
        body: [`${LEGAL_ENTITY_EN} (${LEGAL_ENTITY}), registration ID ${LEGAL_ID}, Tbilisi, Georgia. Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  ka: {
    eyebrow: 'იურიდიული',
    title: 'კონფიდენციალურობის პოლიტიკა',
    updated: 'ბოლო განახლება: 2026 წლის სექტემბერი',
    intro:
      `ეს პოლიტიკა განმარტავს, თუ რას აგროვებს ${LEGAL_ENTITY} ("Networker", "ჩვენ") Networker CRM პლატფორმის (შემდგომში — "სერვისი") გამოყენებისას, რატომ, და რა კონტროლი გაქვთ ამაზე. ის მოიცავს როგორც ამ საიტს, ისე თავად CRM აპლიკაციას.`,
    sections: [
      {
        heading: '1. ვისზე ვრცელდება',
        body: [
          'ეს პოლიტიკა მოიცავს ორ ჯგუფს: ამ საიტის ვიზიტორებს და Networker CRM პლატფორმის მომხმარებლებს, რომლებიც პლატფორმას იყენებენ გამომწერი ბიზნესის ("კლიენტი") სახელით. თუ ჩვენი კლიენტის მომხმარებელი ხართ (მაგალითად, ვინმეს, ვინც წერს Networker CRM-ის მომხმარებელს WhatsApp-ში ან ურეკავს მის ნომერზე), იხილეთ მე-6 პუნქტი.',
        ],
      },
      {
        heading: '2. რას ვაგროვებთ',
        body: [
          'ანგარიშისა და საკონტაქტო მონაცემები: სახელი, სამუშაო ელფოსტა, ტელეფონის ნომერი, კომპანიის სახელი და საიდენტიფიკაციო ნომერი, როლი — მოწოდებული წვდომის მოთხოვნისას, ჩვენთან დაკავშირებისას, ან კლიენტის მიერ მომხმარებლად დამატებისას.',
          'ზარის მონაცემები: ზარის მეტამონაცემები (დრო, ხანგრძლივობა, მიმართულება), ზარის ჩანაწერები და AI-ის მიერ გენერირებული ტრანსკრიპტები და შეჯამებები, სერვისის მეშვეობით განხორციელებული ან მიღებული ზარებისთვის.',
          'შეტყობინებების მონაცემები: WhatsApp Business შეტყობინებები, გაგზავნილი და მიღებული სერვისის მეშვეობით, Meta Cloud API-ის საშუალებით, და ნებისმიერი Facebook/Instagram ლიდ-ფორმის შევსება, მიღებული Meta ლიდ-რეკლამებით.',
          'CRM ჩანაწერები: კონტაქტის, კომპანიისა და ლიდის მონაცემები, რომელსაც კლიენტის გუნდი შეიყვანს ან იმპორტირებას უკეთებს პლატფორმაზე (სახელები, ტელეფონის ნომრები, ელფოსტები, გარიგების ჩანაწერები და მსგავსი).',
          'გამოყენებისა და მოწყობილობის მონაცემები: ნანახი გვერდები, ბრაუზერის ტიპი და სავარაუდო მდებარეობა (IP მისამართიდან), შეგროვებული ქუქი-ფაილებითა და ანალიტიკის ინსტრუმენტებით ამ საიტზე.',
        ],
      },
      {
        heading: '3. როგორ ვიყენებთ',
        body: [
          'სერვისის უზრუნველსაყოფად: ზარების მარშრუტიზაცია, WhatsApp შეტყობინებების მიწოდება და შენახვა, ლიდების მიღება, თითოეული კლიენტის CRM ჩანაწერების წარმოება.',
          'ზარისა და შეხვედრის ტრანსკრიპტების AI მოდელებით დასამუშავებლად (იხილეთ მე-4 პუნქტი), რათა პლატფორმამ შეძლოს ზარის შეჯამება, შემდეგი ნაბიჯის შემოთავაზება, ან შეტყობინების პროექტის მომზადება — ყოველთვის განსახილველი, და უმეტეს შემთხვევაში რედაქტირებადი ან დასადასტურებელი კლიენტის საკუთარი პერსონალის მიერ.',
          'პლატფორმის ფუნქციონირების, დაცვისა და გაუმჯობესებისთვის, პრობლემების დიაგნოსტიკისა და ბოროტად გამოყენების პრევენციის ჩათვლით.',
          'თქვენთან დასაკავშირებლად თქვენი ანგარიშის, მოთხოვნილი წვდომის ან მხარდაჭერის საკითხებზე.',
        ],
      },
      {
        heading: '4. AI დამუშავება',
        body: [
          'ზარისა და შეხვედრის ტრანსკრიპტები, და ასევე CRM-ის ის კონტექსტი, რომელიც საჭიროა მათზე მოქმედებისთვის, იგზავნება მესამე მხარის AI პროვაიდერებთან (ამჟამად Anthropic და/ან Google, პლატფორმის კონფიგურაციის მიხედვით) შეჯამების, შემდეგი ნაბიჯების შემოთავაზებისა და თარგმანის გენერირებისთვის. ეს პროვაიდერები ამუშავებენ მონაცემებს მხოლოდ იმისთვის, რომ დააბრუნონ პასუხი კონკრეტულ მოთხოვნაზე; ჩვენ არ ვაძლევთ მათ ნებართვას, გამოიყენონ კლიენტის მონაცემები საკუთარი მოდელების გასაწვრთნელად.',
          'AI-ის მიერ შემოთავაზებული ქმედებები (მაგალითად, დავალების შექმნა ან დოკუმენტის გაგზავნა) ილოგირება და, კლიენტის კონფიგურაციის მიხედვით, საჭიროებს ადამიანის დადასტურებას, სანამ რამე გაეგზავნება რეალურ კონტაქტს.',
        ],
      },
      {
        heading: '5. ვისთან ვუზიარებთ მონაცემებს',
        body: [
          'ქვე-დამმუშავებლები, რომლებიც გვეხმარებიან სერვისის ფუნქციონირებაში: ჩვენი ღრუბლოვანი ჰოსტინგის პროვაიდერი, Meta Platforms (WhatsApp Business API-სა და Meta ლიდ-რეკლამების ინტეგრაციისთვის), მე-4 პუნქტში აღწერილი AI პროვაიდერები და ჩვენი ელფოსტის/SMTP პროვაიდერი.',
          'ჩვენ არ ვყიდით პირად მონაცემებს და არ ვუზიარებთ კლიენტის მონაცემებს მესამე მხარეებს მათი საკუთარი მარკეტინგული მიზნებისთვის.',
          'შესაძლოა გავამჟღავნოთ მონაცემები კანონმდებლობის მოთხოვნისას, ან Networker-ის, ჩვენი კლიენტების ან სხვების უფლებების, უსაფრთხოების ან საკუთრების დასაცავად.',
        ],
      },
      {
        heading: '6. თუ ჩვენს რომელიმე კლიენტს დაუკავშირდით',
        body: [
          'თუ დარეკეთ, მისწერეთ ან შეავსეთ ლიდ-ფორმა ბიზნესისთვის, რომელიც იყენებს Networker-ს, თქვენს მონაცემებზე (შეტყობინების შინაარსი, ზარის ჩანაწერი, საკონტაქტო დეტალები) კონტროლს ახორციელებს ის ბიზნესი, არა ჩვენ — ჩვენ მათ ვამუშავებთ მათი სახელით, მათივე ინსტრუქციით, როგორც მათი მონაცემთა დამმუშავებელი. წვდომის ან წაშლის მოთხოვნები უნდა მიემართოს იმ ბიზნესს, რომელსაც დაუკავშირდით; ჩვენ ვეხმარებით მათ ასეთი მოთხოვნების შესრულებაში.',
        ],
      },
      {
        heading: '7. მონაცემთა შენახვის ვადა',
        body: [
          'კლიენტის ანგარიშისა და CRM მონაცემებს ვინახავთ იმ დრომდე, სანამ კლიენტის გამოწერა აქტიურია, პლუს შეზღუდული პერიოდი შეწყვეტის შემდეგ მონაცემთა ექსპორტის შესაძლებლობისთვის, თუ არ არის შეთანხმებული უფრო მოკლე ვადა ან კანონმდებლობა არ მოითხოვს უფრო გრძელს.',
          'ზარის ჩანაწერები და ტრანსკრიპტები ინახება კლიენტის საკუთარი კონფიგურირებული შენახვის პარამეტრების მიხედვით.',
        ],
      },
      {
        heading: '8. უსაფრთხოება',
        body: [
          'მგრძნობიარე მონაცემები და საიდუმლოებები დაშიფრულია მოსვენებულ მდგომარეობაში. თითოეული კლიენტის მონაცემები ლოგიკურად იზოლირებულია ყველა სხვა კლიენტის მონაცემებისგან მონაცემთა ბაზის დონეზე. ჩვენი პერსონალის წვდომა კლიენტის მონაცემებზე შემოიფარგლება მხარდაჭერისა და პლატფორმის ფუნქციონირებისთვის საჭირო მინიმუმით და ილოგირება.',
        ],
      },
      {
        heading: '9. თქვენი უფლებები',
        body: [
          'ჩვენთან თქვენი ურთიერთობის მიხედვით, შესაძლოა გქონდეთ უფლება, მოითხოვოთ წვდომა, გასწოროთ, ექსპორტირება გაუკეთოთ ან წაშლა მოითხოვოთ თქვენს პირად მონაცემებზე. ამ უფლებების გამოსაყენებლად დაგვიკავშირდით ქვემოთ მითითებულ მისამართზე; თუ თქვენი მონაცემები შეგროვდა ჩვენი რომელიმე კლიენტის სახელით, შესაძლოა თქვენი მოთხოვნა მათთან გადავამისამართოთ.',
        ],
      },
      {
        heading: '10. ქუქი-ფაილები და ანალიტიკა',
        body: [
          'ეს საიტი იყენებს ქუქი-ფაილებსა და კონფიდენციალურობის მიმართ პასუხისმგებელ ანალიტიკურ ინსტრუმენტს, რათა გავიგოთ, როგორ იყენებენ ვიზიტორები საიტს და გავაუმჯობესოთ ის. ქუქი-ფაილების კონტროლი შეგიძლიათ ბრაუზერის პარამეტრებით.',
        ],
      },
      {
        heading: '11. ბავშვები',
        body: ['სერვისი განკუთვნილია ბიზნეს გამოყენებისთვის და არ არის მიმართული ან შეგნებულად გამოყენებული ბავშვების მიერ.'],
      },
      {
        heading: '12. ცვლილებები ამ პოლიტიკაში',
        body: ['ჩვენ განვაახლებთ ამ გვერდს, როდესაც ჩვენი პრაქტიკა შეიცვლება, და შესაბამისად განვაახლებთ გვერდის თავში მითითებულ თარიღს.'],
      },
      {
        heading: '13. დაგვიკავშირდით',
        body: [`${LEGAL_ENTITY}, საიდენტიფიკაციო ნომერი ${LEGAL_ID}, თბილისი, საქართველო. ელფოსტა: ${CONTACT_EMAIL}`],
      },
    ],
  },
}

export const TERMS_CONTENT: Record<Lang, LegalPage> = {
  en: {
    eyebrow: 'Legal',
    title: 'Terms and Conditions',
    updated: 'Last updated: September 2026',
    intro:
      `These terms govern access to and use of the Networker CRM platform (the "Service"), operated by ${LEGAL_ENTITY_EN} (${LEGAL_ENTITY}). By creating an account or using the Service, you agree to these terms on behalf of yourself and, if applicable, the business you represent ("Customer").`,
    sections: [
      {
        heading: '1. The Service',
        body: [
          'Networker provides a business CRM platform including telephony, AI-assisted call analysis, a shared WhatsApp inbox, and Meta lead capture, delivered as a hosted, subscription service.',
        ],
      },
      {
        heading: '2. Accounts and eligibility',
        body: [
          'You must be authorized to act on behalf of the business you represent to create an account. You are responsible for the accuracy of information provided and for activity under your account.',
        ],
      },
      {
        heading: '3. Subscription and fees',
        body: [
          'The Service is billed per user, per month, at the rate published on this site or agreed in writing, all features included unless otherwise stated. Fees are payable in advance and are non-refundable except where required by law or expressly agreed.',
          'We may change pricing for future billing periods with reasonable prior notice.',
        ],
      },
      {
        heading: '4. Acceptable use',
        body: [
          'You agree not to use the Service to send unsolicited bulk messages, to violate WhatsApp\'s or Meta\'s platform policies, to store or process data you are not authorized to hold, or to attempt to disrupt or reverse-engineer the Service.',
          'We may suspend accounts that violate this section, or that put the platform, other Customers, or third parties at risk.',
        ],
      },
      {
        heading: '5. Customer data',
        body: [
          'Customer retains ownership of all data it enters into or generates through the Service (contacts, call recordings, messages, CRM records). We process this data solely to provide the Service, per our Privacy Policy.',
          'Customer is responsible for having the legal right to collect and process the personal data of its own contacts (leads, customers) that it stores in the Service, including obtaining any consents required for recorded calls or marketing messages under applicable law.',
        ],
      },
      {
        heading: '6. Third-party services',
        body: [
          'The Service integrates with third-party platforms, including Meta (WhatsApp Business API, Facebook/Instagram lead ads) and AI providers (currently Anthropic and/or Google). Use of these integrations is also subject to those providers\' own terms, and their availability may change outside our control.',
        ],
      },
      {
        heading: '7. Intellectual property',
        body: [
          'Networker and its licensors retain all rights to the Service itself (software, design, trademarks). These terms grant Customer a limited, non-exclusive right to use the Service during an active subscription — nothing more.',
        ],
      },
      {
        heading: '8. Availability and support',
        body: [
          'We aim for high availability but do not guarantee uninterrupted access. Planned maintenance will be communicated in advance where practical. Support is provided by the channels published on this site.',
        ],
      },
      {
        heading: '9. Limitation of liability',
        body: [
          'To the maximum extent permitted by law, Networker\'s total liability for any claim arising from use of the Service is limited to the fees paid by Customer in the three months preceding the claim. We are not liable for indirect, incidental, or consequential damages, including lost profits or lost data, except where such limitation is not permitted by law.',
        ],
      },
      {
        heading: '10. Termination',
        body: [
          'Either party may terminate a subscription per the terms agreed at signup, or on notice where no fixed term applies. On termination, Customer may export its data for a limited period before it is deleted, per our Privacy Policy\'s retention terms.',
        ],
      },
      {
        heading: '11. Governing law',
        body: ['These terms are governed by the laws of Georgia. Disputes will be resolved in the competent courts of Tbilisi, Georgia, unless otherwise agreed in writing.'],
      },
      {
        heading: '12. Changes to these terms',
        body: ['We may update these terms from time to time. Material changes will be communicated to active Customers with reasonable notice before taking effect.'],
      },
      {
        heading: '13. Contact us',
        body: [`${LEGAL_ENTITY_EN} (${LEGAL_ENTITY}), registration ID ${LEGAL_ID}, Tbilisi, Georgia. Email: ${CONTACT_EMAIL}`],
      },
    ],
  },
  ka: {
    eyebrow: 'იურიდიული',
    title: 'წესები და პირობები',
    updated: 'ბოლო განახლება: 2026 წლის სექტემბერი',
    intro:
      `ეს წესები არეგულირებს Networker CRM პლატფორმაზე (შემდგომში — "სერვისი") წვდომასა და მის გამოყენებას, რომელსაც ოპერირებას უწევს ${LEGAL_ENTITY}. ანგარიშის შექმნით ან სერვისის გამოყენებით, თქვენ ეთანხმებით ამ წესებს საკუთარი და, საჭიროების შემთხვევაში, იმ ბიზნესის სახელით, რომელსაც წარმოადგენთ ("კლიენტი").`,
    sections: [
      {
        heading: '1. სერვისი',
        body: [
          'Networker უზრუნველყოფს ბიზნეს CRM პლატფორმას, ტელეფონიის, AI-ით მხარდაჭერილი ზარების ანალიზის, გაზიარებული WhatsApp ინბოქსისა და Meta ლიდების მიღების ჩათვლით, მოწოდებულს ჰოსტირებული გამოწერის სერვისის სახით.',
        ],
      },
      {
        heading: '2. ანგარიშები და უფლებამოსილება',
        body: [
          'ანგარიშის შესაქმნელად თქვენ უნდა გქონდეთ უფლებამოსილება, იმოქმედოთ იმ ბიზნესის სახელით, რომელსაც წარმოადგენთ. თქვენ პასუხისმგებელი ხართ მოწოდებული ინფორმაციის სიზუსტესა და თქვენი ანგარიშის ქვეშ განხორციელებულ აქტივობაზე.',
        ],
      },
      {
        heading: '3. გამოწერა და საფასური',
        body: [
          'სერვისს ვაფასებთ ერთ მომხმარებელზე, თვეში, ამ საიტზე გამოქვეყნებული ან წერილობით შეთანხმებული ტარიფით, ყველა ფუნქციის ჩათვლით, თუ სხვაგვარად არ არის მითითებული. საფასური გადასახდელია წინასწარ და არ ბრუნდება, გარდა კანონმდებლობით მოთხოვნილი ან პირდაპირ შეთანხმებული შემთხვევებისა.',
          'ჩვენ შეგვიძლია შევცვალოთ ფასები მომავალი ბილინგის პერიოდებისთვის, გონივრული წინასწარი შეტყობინებით.',
        ],
      },
      {
        heading: '4. დასაშვები გამოყენება',
        body: [
          'თქვენ თანხმდებით, არ გამოიყენოთ სერვისი არასასურველი მასობრივი შეტყობინებების გასაგზავნად, WhatsApp-ის ან Meta-ს პლატფორმის პოლიტიკების დარღვევისთვის, თქვენთვის ნებადართული არ არსებული მონაცემების შესანახად ან დასამუშავებლად, ან სერვისის დაზიანების ან უკუინჟინერიის მცდელობისთვის.',
          'ჩვენ შეგვიძლია შევაჩეროთ ანგარიშები, რომლებიც არღვევენ ამ პუნქტს, ან საფრთხეს უქმნიან პლატფორმას, სხვა კლიენტებს ან მესამე მხარეებს.',
        ],
      },
      {
        heading: '5. კლიენტის მონაცემები',
        body: [
          'კლიენტი ინარჩუნებს საკუთრებას ყველა მონაცემზე, რომელსაც შეაქვს ან ქმნის სერვისის მეშვეობით (კონტაქტები, ზარის ჩანაწერები, შეტყობინებები, CRM ჩანაწერები). ჩვენ ვამუშავებთ ამ მონაცემებს მხოლოდ სერვისის მისაწოდებლად, ჩვენი კონფიდენციალურობის პოლიტიკის შესაბამისად.',
          'კლიენტი პასუხისმგებელია, ჰქონდეს იურიდიული უფლება, შეაგროვოს და დაამუშაოს საკუთარი კონტაქტების (ლიდები, კლიენტები) პირადი მონაცემები, რომლებსაც ინახავს სერვისში, გამოყენებადი კანონმდებლობით მოთხოვნილი ნებისმიერი თანხმობის მიღების ჩათვლით ჩაწერილი ზარებისთვის ან მარკეტინგული შეტყობინებებისთვის.',
        ],
      },
      {
        heading: '6. მესამე მხარის სერვისები',
        body: [
          'სერვისი ინტეგრირდება მესამე მხარის პლატფორმებთან, მათ შორის Meta (WhatsApp Business API, Facebook/Instagram ლიდ-რეკლამები) და AI პროვაიდერებთან (ამჟამად Anthropic და/ან Google). ამ ინტეგრაციების გამოყენებაზე ასევე ვრცელდება ამ პროვაიდერების საკუთარი წესები, და მათი ხელმისაწვდომობა შესაძლოა შეიცვალოს ჩვენი კონტროლის მიღმა.',
        ],
      },
      {
        heading: '7. ინტელექტუალური საკუთრება',
        body: [
          'Networker და მისი ლიცენზიარები ინარჩუნებენ ყველა უფლებას თავად სერვისზე (პროგრამული უზრუნველყოფა, დიზაინი, სავაჭრო ნიშნები). ეს წესები კლიენტს ანიჭებს შეზღუდულ, არაექსკლუზიურ უფლებას, გამოიყენოს სერვისი აქტიური გამოწერის განმავლობაში — არაფერი მეტი.',
        ],
      },
      {
        heading: '8. ხელმისაწვდომობა და მხარდაჭერა',
        body: [
          'ჩვენ ვცდილობთ მაღალ ხელმისაწვდომობას, თუმცა არ ვიძლევით გარანტიას შეუფერხებელ წვდომაზე. დაგეგმილი ტექნიკური სამუშაოების შესახებ შეტყობინება მოხდება წინასწარ, სადაც ეს პრაქტიკულად შესაძლებელია. მხარდაჭერა ხორციელდება ამ საიტზე გამოქვეყნებული არხებით.',
        ],
      },
      {
        heading: '9. პასუხისმგებლობის შეზღუდვა',
        body: [
          'კანონმდებლობით დაშვებული მაქსიმალური ზღვრით, Networker-ის ჯამური პასუხისმგებლობა სერვისის გამოყენებიდან გამომდინარე ნებისმიერ პრეტენზიაზე შემოიფარგლება კლიენტის მიერ პრეტენზიის წინა სამი თვის განმავლობაში გადახდილი საფასურით. ჩვენ არ ვართ პასუხისმგებელი არაპირდაპირ, შემთხვევით ან თანმდევ ზიანზე, მოგებულის დაკარგვის ან მონაცემების დაკარგვის ჩათვლით, გარდა იმ შემთხვევებისა, როცა ასეთი შეზღუდვა კანონმდებლობით არ არის დაშვებული.',
        ],
      },
      {
        heading: '10. შეწყვეტა',
        body: [
          'ნებისმიერ მხარეს შეუძლია შეწყვიტოს გამოწერა რეგისტრაციისას შეთანხმებული პირობების შესაბამისად, ან შეტყობინებით, თუ ფიქსირებული ვადა არ ვრცელდება. შეწყვეტისას კლიენტს შეუძლია მონაცემების ექსპორტი შეზღუდული პერიოდის განმავლობაში მათი წაშლამდე, ჩვენი კონფიდენციალურობის პოლიტიკის შენახვის პირობების შესაბამისად.',
        ],
      },
      {
        heading: '11. მარეგულირებელი კანონმდებლობა',
        body: ['ეს წესები რეგულირდება საქართველოს კანონმდებლობით. დავები გადაწყდება თბილისის, საქართველოს კომპეტენტურ სასამართლოებში, თუ წერილობით სხვაგვარად არ არის შეთანხმებული.'],
      },
      {
        heading: '12. ცვლილებები ამ წესებში',
        body: ['ჩვენ შეგვიძლია პერიოდულად განვაახლოთ ეს წესები. არსებით ცვლილებებზე შეტყობინება მიეწოდებათ აქტიურ კლიენტებს ძალაში შესვლამდე გონივრული ვადით ადრე.'],
      },
      {
        heading: '13. დაგვიკავშირდით',
        body: [`${LEGAL_ENTITY}, საიდენტიფიკაციო ნომერი ${LEGAL_ID}, თბილისი, საქართველო. ელფოსტა: ${CONTACT_EMAIL}`],
      },
    ],
  },
}
