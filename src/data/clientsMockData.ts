// Mock data for the Clients mobile UI (Hebrew / Israeli e-commerce context).
// Mirrors the structure of the design handoff bundle's data.jsx.

export type TagKey =
  | 'vip'
  | 'wholesale'
  | 'retail'
  | 'new'
  | 'recurring'
  | 'late'
  | 'online'
  | 'b2b'

export type TagColor =
  | 'amber'
  | 'violet'
  | 'sky'
  | 'emerald'
  | 'indigo'
  | 'rose'
  | 'cyan'
  | 'slate'

export const TAG_HE: Record<TagKey, string> = {
  vip: 'VIP',
  wholesale: 'סיטונאי',
  retail: 'קמעונאי',
  new: 'חדש',
  recurring: 'קבוע',
  late: 'מאחר',
  online: 'אונליין',
  b2b: 'B2B',
}

export const TAG_COLOR: Record<TagKey, TagColor> = {
  vip: 'amber',
  wholesale: 'violet',
  retail: 'sky',
  new: 'emerald',
  recurring: 'indigo',
  late: 'rose',
  online: 'cyan',
  b2b: 'slate',
}

export type Client = {
  id: string
  no: number
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  city: string
  tags: TagKey[]
  balance: number
  activeInvoices: number
  openOrders: number
  lastPurchase: string
  joinDate: string
  status: 'active' | 'on_hold'
  creditLimit: number
  owner: string
  notes: string
  companyName: string
  taxId: string
  terms: string
}

export const CLIENTS: Client[] = [
  { id: 'CL-1042', no: 1042, firstName: 'דורון', lastName: 'הרצוג', phone: '03-5234108', email: 'doron@herzog-co.co.il', address: 'הרברט סמואל 14, תל אביב', city: 'תל אביב', tags: ['vip', 'wholesale', 'recurring'], balance: -2840, activeInvoices: 2, openOrders: 4, lastPurchase: '06.05.2026', joinDate: '12.03.2022', status: 'active', creditLimit: 25000, owner: 'נועה ל.', notes: 'מעדיף משלוח ביום ראשון בשעות הבוקר. לא לשלוח בערב חג.', companyName: 'הרצוג ובניו בע״מ', taxId: '514938821', terms: 'שוטף + 30' },
  { id: 'CL-1098', no: 1098, firstName: 'מאיה', lastName: 'רביד', phone: '052-7748120', email: 'maya@organic.studio', address: 'ויצמן 22, גבעתיים', city: 'גבעתיים', tags: ['retail', 'online'], balance: 0, activeInvoices: 1, openOrders: 1, lastPurchase: '04.05.2026', joinDate: '21.08.2024', status: 'active', creditLimit: 5000, owner: 'יואב ק.', notes: 'חשבוניות במייל בלבד.', companyName: 'סטודיו אורגני', taxId: '301298720', terms: 'מיידי' },
  { id: 'CL-1131', no: 1131, firstName: 'אסף', lastName: 'ברנע', phone: '04-8112250', email: 'office@adama.cafe', address: 'הנמל 18, חיפה', city: 'חיפה', tags: ['recurring', 'wholesale'], balance: -540, activeInvoices: 1, openOrders: 2, lastPurchase: '07.05.2026', joinDate: '02.11.2023', status: 'active', creditLimit: 12000, owner: 'נועה ל.', notes: 'משלוח 3 פעמים בשבוע — א/ג/ה.', companyName: 'בית קפה אדמה', taxId: '512200118', terms: 'שוטף + 30' },
  { id: 'CL-1154', no: 1154, firstName: 'דרור', lastName: 'פרץ', phone: '050-3398201', email: 'dror@dror-jewelry.com', address: 'בן יהודה 92, תל אביב', city: 'תל אביב', tags: ['retail', 'online', 'recurring'], balance: 1200, activeInvoices: 0, openOrders: 0, lastPurchase: '03.05.2026', joinDate: '17.06.2021', status: 'active', creditLimit: 8000, owner: 'תמר ס.', notes: 'יש זיכוי פתוח — ₪1,200.', companyName: 'דרור פרץ — תכשיטים', taxId: '044193210', terms: 'שוטף + 15' },
  { id: 'CL-1188', no: 1188, firstName: 'רננה', lastName: 'כהן', phone: '09-7745920', email: 'rinat@flora.co.il', address: 'סוקולוב 91, הרצליה', city: 'הרצליה', tags: ['wholesale', 'late'], balance: -8920, activeInvoices: 3, openOrders: 1, lastPurchase: '28.04.2026', joinDate: '08.01.2023', status: 'active', creditLimit: 15000, owner: 'יואב ק.', notes: 'בפיגור — שיחת תזכורת בוצעה 06.05.', companyName: 'מרכז הצמחים פלורה', taxId: '511820934', terms: 'שוטף + 60' },
  { id: 'CL-1206', no: 1206, firstName: 'תמר', lastName: 'זוהר', phone: '03-9981277', email: 'tamar@design-shop.co.il', address: 'הרצל 44, רמת גן', city: 'רמת גן', tags: ['retail', 'recurring'], balance: -120, activeInvoices: 1, openOrders: 0, lastPurchase: '05.05.2026', joinDate: '14.09.2023', status: 'active', creditLimit: 6000, owner: 'תמר ס.', notes: '', companyName: 'חנות העיצוב — תמר', taxId: '027781109', terms: 'שוטף + 30' },
  { id: 'CL-1219', no: 1219, firstName: 'אביב', lastName: 'שלמה', phone: '08-6627012', email: 'aviv@delamer.co.il', address: 'רגר 80, באר שבע', city: 'באר שבע', tags: ['wholesale', 'recurring', 'b2b'], balance: -4150, activeInvoices: 2, openOrders: 3, lastPurchase: '07.05.2026', joinDate: '03.02.2022', status: 'active', creditLimit: 20000, owner: 'נועה ל.', notes: 'משלוח מקורר — לא לשלוח בימי חמישי-שישי.', companyName: 'שוקולד דה-לה-מר', taxId: '514120093', terms: 'שוטף + 30' },
  { id: 'CL-1244', no: 1244, firstName: 'מאי', lastName: 'זוהר', phone: '054-2218977', email: 'mai@zohar-boutique.com', address: 'דיזנגוף 122, תל אביב', city: 'תל אביב', tags: ['retail', 'online', 'new'], balance: 0, activeInvoices: 1, openOrders: 1, lastPurchase: '06.05.2026', joinDate: '02.04.2026', status: 'active', creditLimit: 3000, owner: 'יואב ק.', notes: 'לקוחה חדשה — לבדוק שביעות רצון אחרי הזמנה ראשונה.', companyName: 'בוטיק זוהר', taxId: '038122944', terms: 'מיידי' },
  { id: 'CL-1255', no: 1255, firstName: 'אבי', lastName: 'לוין', phone: '02-5012099', email: 'avi@bread.co.il', address: 'יפו 38, ירושלים', city: 'ירושלים', tags: ['wholesale', 'recurring'], balance: -1880, activeInvoices: 1, openOrders: 2, lastPurchase: '06.05.2026', joinDate: '19.07.2023', status: 'active', creditLimit: 10000, owner: 'תמר ס.', notes: '', companyName: 'מאפיית הלחם של אבי', taxId: '511778420', terms: 'שוטף + 30' },
  { id: 'CL-1278', no: 1278, firstName: 'יעל', lastName: 'נחשון', phone: '03-7723041', email: 'yael@nahshon-arch.com', address: 'שלמה המלך 4, תל אביב', city: 'תל אביב', tags: ['b2b', 'vip'], balance: 0, activeInvoices: 0, openOrders: 0, lastPurchase: '29.04.2026', joinDate: '10.05.2020', status: 'active', creditLimit: 30000, owner: 'נועה ל.', notes: '', companyName: 'אדריכלות נחשון', taxId: '514200391', terms: 'שוטף + 60' },
  { id: 'CL-1299', no: 1299, firstName: 'רוני', lastName: 'שני', phone: '04-6612388', email: 'roni@kid-zoo.co.il', address: 'שדרות הגעתון 31, נהריה', city: 'נהריה', tags: ['retail', 'late'], balance: -3120, activeInvoices: 2, openOrders: 0, lastPurchase: '24.04.2026', joinDate: '11.10.2024', status: 'on_hold', creditLimit: 4000, owner: 'יואב ק.', notes: 'מושהה — חוב מעל 30 יום.', companyName: 'גן חיות הילדים', taxId: '030228111', terms: 'שוטף + 30' },
  { id: 'CL-1312', no: 1312, firstName: 'גלעד', lastName: 'שמיר', phone: '04-9988120', email: 'gilad@harwine.co.il', address: 'מעלה הצופים 4, צפת', city: 'צפת', tags: ['wholesale', 'vip', 'recurring'], balance: -12400, activeInvoices: 4, openOrders: 5, lastPurchase: '05.05.2026', joinDate: '14.02.2019', status: 'active', creditLimit: 50000, owner: 'נועה ל.', notes: 'הזמנות גדולות — לתאם עם הסניף 24 שעות מראש.', companyName: 'יקבי ההר', taxId: '514002298', terms: 'שוטף + 60' },
  { id: 'CL-1330', no: 1330, firstName: 'נטע', lastName: 'שורש', phone: '050-7723451', email: 'neta@shoresh.studio', address: 'הדגן 7, פרדס חנה', city: 'פרדס חנה', tags: ['retail', 'online'], balance: 0, activeInvoices: 0, openOrders: 0, lastPurchase: '02.05.2026', joinDate: '20.12.2024', status: 'active', creditLimit: 4000, owner: 'תמר ס.', notes: '', companyName: 'סטודיו לקרמיקה — שורש', taxId: '040118729', terms: 'מיידי' },
  { id: 'CL-1351', no: 1351, firstName: 'עומר', lastName: 'ביטון', phone: '08-9712233', email: 'omer@nature-school.org.il', address: 'דרך הים 17, אשקלון', city: 'אשקלון', tags: ['b2b', 'new'], balance: -780, activeInvoices: 1, openOrders: 1, lastPurchase: '07.05.2026', joinDate: '15.03.2026', status: 'active', creditLimit: 5000, owner: 'יואב ק.', notes: '', companyName: 'בית הספר לטבע', taxId: '580301220', terms: 'שוטף + 30' },
  { id: 'CL-1362', no: 1362, firstName: 'דניאל', lastName: 'פרץ', phone: '03-6677019', email: 'daniel@louisa.rest', address: 'דיזנגוף 211, תל אביב', city: 'תל אביב', tags: ['wholesale', 'recurring', 'vip'], balance: -2210, activeInvoices: 1, openOrders: 2, lastPurchase: '08.05.2026', joinDate: '06.06.2022', status: 'active', creditLimit: 18000, owner: 'נועה ל.', notes: 'מסעדה. תשלום שוטף+30.', companyName: 'מסעדת לואיזה', taxId: '514881229', terms: 'שוטף + 30' },
  { id: 'CL-1378', no: 1378, firstName: 'יורם', lastName: 'קליין', phone: '03-5512298', email: 'yoram@klein.co.il', address: 'ז׳בוטינסקי 60, ראשון לציון', city: 'ראשון לציון', tags: ['b2b', 'recurring'], balance: -560, activeInvoices: 1, openOrders: 1, lastPurchase: '05.05.2026', joinDate: '01.09.2022', status: 'active', creditLimit: 9000, owner: 'תמר ס.', notes: '', companyName: 'קליין ושות׳', taxId: '514120930', terms: 'שוטף + 30' },
  { id: 'CL-1391', no: 1391, firstName: 'שירה', lastName: 'בלום', phone: '054-9182039', email: 'shira@habad.co.il', address: 'אלנבי 70, תל אביב', city: 'תל אביב', tags: ['retail', 'online', 'recurring'], balance: -90, activeInvoices: 1, openOrders: 0, lastPurchase: '06.05.2026', joinDate: '22.05.2023', status: 'active', creditLimit: 7000, owner: 'יואב ק.', notes: '', companyName: 'אטליה הבד', taxId: '038920019', terms: 'שוטף + 30' },
  { id: 'CL-1404', no: 1404, firstName: 'אלמוג', lastName: 'בן-דוד', phone: '052-3344112', email: 'almog@gallery-almog.com', address: 'יהודה הימית 12, יפו', city: 'יפו', tags: ['b2b', 'vip'], balance: -3300, activeInvoices: 1, openOrders: 0, lastPurchase: '01.05.2026', joinDate: '08.07.2021', status: 'active', creditLimit: 22000, owner: 'נועה ל.', notes: 'אריזה במשטחי-עץ בלבד. שביר.', companyName: 'גלרית אלמוג', taxId: '041209910', terms: 'שוטף + 60' },
  { id: 'CL-1418', no: 1418, firstName: 'בת-אל', lastName: 'מזרחי', phone: '02-9923100', email: 'batel@bat-ein.co.il', address: 'בצלאל 22, ירושלים', city: 'ירושלים', tags: ['retail', 'recurring'], balance: -210, activeInvoices: 1, openOrders: 1, lastPurchase: '07.05.2026', joinDate: '14.01.2025', status: 'active', creditLimit: 4000, owner: 'תמר ס.', notes: '', companyName: 'מעדניית בת-עין', taxId: '034910228', terms: 'שוטף + 15' },
  { id: 'CL-1429', no: 1429, firstName: 'יוני', lastName: 'לוי', phone: '04-6691188', email: 'yoni@matzukei.co.il', address: 'הגדוד העברי 9, עכו', city: 'עכו', tags: ['wholesale', 'new'], balance: 0, activeInvoices: 0, openOrders: 0, lastPurchase: '04.05.2026', joinDate: '03.04.2026', status: 'active', creditLimit: 6000, owner: 'יואב ק.', notes: '', companyName: 'מתנות מצוקי-ים', taxId: '514720399', terms: 'מיידי' },
]

export type Personal = {
  source: string
  totalPurchases: number
  birthDate: string
  anniversary: string
  spouseName: string
  spousePhone: string
  spouseBirth: string
}

export const PERSONAL: Record<string, Personal> = {
  'CL-1042': { source: 'המלצה', totalPurchases: 184500, birthDate: '14.07.1981', anniversary: '03.06.2010', spouseName: 'רחל הרצוג', spousePhone: '054-2218977', spouseBirth: '22.11.1983' },
  'CL-1098': { source: 'אינסטגרם', totalPurchases: 42300, birthDate: '02.04.1990', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1131': { source: 'לקוח חוזר', totalPurchases: 98700, birthDate: '20.09.1978', anniversary: '11.05.2008', spouseName: 'דנה ברנע', spousePhone: '052-3344211', spouseBirth: '04.01.1980' },
  'CL-1154': { source: 'אונליין', totalPurchases: 72400, birthDate: '17.12.1985', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1188': { source: 'המלצה', totalPurchases: 154200, birthDate: '08.06.1976', anniversary: '22.09.2003', spouseName: 'איתן כהן', spousePhone: '050-7711293', spouseBirth: '01.10.1974' },
  'CL-1206': { source: 'גוגל', totalPurchases: 31900, birthDate: '11.03.1991', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1219': { source: 'תערוכה', totalPurchases: 268400, birthDate: '04.11.1972', anniversary: '14.04.1999', spouseName: 'יעל שלמה', spousePhone: '054-1129022', spouseBirth: '07.08.1975' },
  'CL-1244': { source: 'אינסטגרם', totalPurchases: 8800, birthDate: '23.05.1995', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1255': { source: 'לקוח חוזר', totalPurchases: 142800, birthDate: '30.01.1968', anniversary: '02.11.1995', spouseName: 'מירי לוין', spousePhone: '050-9921104', spouseBirth: '15.06.1970' },
  'CL-1278': { source: 'המלצה', totalPurchases: 312000, birthDate: '12.10.1979', anniversary: '08.08.2008', spouseName: 'אלון נחשון', spousePhone: '052-8810022', spouseBirth: '04.04.1977' },
  'CL-1299': { source: 'פייסבוק', totalPurchases: 46000, birthDate: '19.02.1988', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1312': { source: 'תערוכת יין', totalPurchases: 488000, birthDate: '07.07.1965', anniversary: '14.10.1992', spouseName: 'תמר שמיר', spousePhone: '04-9988120', spouseBirth: '19.03.1969' },
  'CL-1330': { source: 'אינסטגרם', totalPurchases: 12300, birthDate: '06.06.1993', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1351': { source: 'גוגל', totalPurchases: 18900, birthDate: '21.08.1986', anniversary: '04.07.2014', spouseName: 'שירי ביטון', spousePhone: '054-2221830', spouseBirth: '13.05.1989' },
  'CL-1362': { source: 'לקוח חוזר', totalPurchases: 198400, birthDate: '02.02.1974', anniversary: '20.05.2001', spouseName: 'הדס פרץ', spousePhone: '050-6612220', spouseBirth: '08.09.1976' },
  'CL-1378': { source: 'המלצה', totalPurchases: 89200, birthDate: '11.11.1980', anniversary: '03.04.2007', spouseName: 'מורן קליין', spousePhone: '050-3387811', spouseBirth: '24.12.1982' },
  'CL-1391': { source: 'אינסטגרם', totalPurchases: 64500, birthDate: '04.04.1987', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
  'CL-1404': { source: 'המלצה', totalPurchases: 224700, birthDate: '15.05.1971', anniversary: '12.06.1998', spouseName: 'מיכאל בן-דוד', spousePhone: '052-7733189', spouseBirth: '02.02.1973' },
  'CL-1418': { source: 'לקוח חוזר', totalPurchases: 37800, birthDate: '28.10.1989', anniversary: '14.02.2018', spouseName: 'עדי מזרחי', spousePhone: '050-4480199', spouseBirth: '11.07.1986' },
  'CL-1429': { source: 'גוגל', totalPurchases: 6200, birthDate: '07.09.1992', anniversary: '—', spouseName: '', spousePhone: '', spouseBirth: '' },
}

export type InvoiceStatus = 'open' | 'overdue' | 'paid' | 'issued'

export type Invoice = {
  id: string
  date: string
  due: string
  amount: number
  status: InvoiceStatus
  items: number
  ref: string
  kind?: 'credit'
}

export const INVOICES_BY_CLIENT: Record<string, Invoice[]> = {
  'CL-1042': [
    { id: '2026-0214', date: '06.05.2026', due: '05.06.2026', amount: 4280, status: 'open', items: 6, ref: 'הזמנה #4421' },
    { id: '2026-0188', date: '20.04.2026', due: '20.05.2026', amount: 1860, status: 'open', items: 3, ref: 'הזמנה #4408' },
    { id: '2026-0140', date: '28.03.2026', due: '27.04.2026', amount: 3300, status: 'paid', items: 5, ref: 'הזמנה #4391' },
    { id: '2026-0098', date: '11.03.2026', due: '10.04.2026', amount: 5210, status: 'paid', items: 8, ref: 'הזמנה #4377' },
    { id: '2026-0061', date: '02.03.2026', due: '—', amount: -540, status: 'issued', items: 1, ref: 'זיכוי על פגום', kind: 'credit' },
  ],
  'CL-1188': [
    { id: '2026-0203', date: '02.05.2026', due: '01.06.2026', amount: 3420, status: 'overdue', items: 4, ref: 'הזמנה #4444' },
    { id: '2026-0177', date: '15.04.2026', due: '15.05.2026', amount: 2780, status: 'overdue', items: 3, ref: 'הזמנה #4419' },
    { id: '2026-0149', date: '01.04.2026', due: '01.05.2026', amount: 2720, status: 'overdue', items: 4, ref: 'הזמנה #4395' },
  ],
  'CL-1312': [
    { id: '2026-0220', date: '05.05.2026', due: '04.07.2026', amount: 12400, status: 'open', items: 14, ref: 'הזמנה #4459' },
    { id: '2026-0210', date: '28.04.2026', due: '27.06.2026', amount: 8800, status: 'open', items: 9, ref: 'הזמנה #4451' },
    { id: '2026-0199', date: '20.04.2026', due: '19.06.2026', amount: 6210, status: 'open', items: 7, ref: 'הזמנה #4438' },
    { id: '2026-0178', date: '11.04.2026', due: '10.06.2026', amount: 4900, status: 'open', items: 6, ref: 'הזמנה #4427' },
    { id: '2026-0119', date: '20.03.2026', due: '19.05.2026', amount: 11200, status: 'paid', items: 13, ref: 'הזמנה #4402' },
  ],
  'CL-1131': [
    { id: '2026-0218', date: '04.05.2026', due: '03.06.2026', amount: 1820, status: 'open', items: 4, ref: 'הזמנה #4458' },
    { id: '2026-0192', date: '22.04.2026', due: '22.05.2026', amount: 1240, status: 'paid', items: 3, ref: 'הזמנה #4429' },
  ],
  'CL-1154': [
    { id: '2026-0211', date: '03.05.2026', due: '02.06.2026', amount: -1200, status: 'issued', items: 1, ref: 'זיכוי על החזרה', kind: 'credit' },
    { id: '2026-0170', date: '14.04.2026', due: '14.05.2026', amount: 980, status: 'paid', items: 2, ref: 'הזמנה #4416' },
  ],
}

export const INVOICES_DEFAULT: Invoice[] = [
  { id: '2026-0212', date: '04.05.2026', due: '03.06.2026', amount: 1240, status: 'open', items: 3, ref: 'הזמנה #4456' },
  { id: '2026-0181', date: '17.04.2026', due: '17.05.2026', amount: 980, status: 'paid', items: 2, ref: 'הזמנה #4424' },
]

export type Receipt = {
  id: string
  date: string
  amount: number
  method: string
  ref: string
}

export const RECEIPTS_BY_CLIENT: Record<string, Receipt[]> = {
  'CL-1042': [
    { id: 'R-2026-0152', date: '02.04.2026', amount: 3300, method: 'העברה בנקאית', ref: 'חשבונית 2026-0140' },
    { id: 'R-2026-0107', date: '15.03.2026', amount: 5210, method: 'העברה בנקאית', ref: 'חשבונית 2026-0098' },
    { id: 'R-2026-0072', date: '04.03.2026', amount: 2100, method: 'אשראי', ref: 'חשבונית 2026-0080' },
  ],
  'CL-1131': [
    { id: 'R-2026-0193', date: '23.04.2026', amount: 1240, method: 'אשראי', ref: 'חשבונית 2026-0192' },
    { id: 'R-2026-0142', date: '30.03.2026', amount: 1820, method: 'מזומן', ref: 'חשבונית 2026-0118' },
  ],
  'CL-1154': [{ id: 'R-2026-0171', date: '15.04.2026', amount: 980, method: 'אשראי', ref: 'חשבונית 2026-0170' }],
  'CL-1206': [
    { id: 'R-2026-0184', date: '20.04.2026', amount: 720, method: 'העברה בנקאית', ref: 'חשבונית 2026-0179' },
    { id: 'R-2026-0140', date: '02.04.2026', amount: 540, method: 'אשראי', ref: 'חשבונית 2026-0131' },
  ],
  'CL-1255': [
    { id: 'R-2026-0188', date: '24.04.2026', amount: 1880, method: 'העברה בנקאית', ref: 'חשבונית 2026-0144' },
    { id: 'R-2026-0099', date: '11.03.2026', amount: 1640, method: 'העברה בנקאית', ref: 'חשבונית 2026-0070' },
  ],
  'CL-1312': [
    { id: 'R-2026-0150', date: '03.04.2026', amount: 11200, method: 'העברה בנקאית', ref: 'חשבונית 2026-0119' },
    { id: 'R-2026-0080', date: '02.03.2026', amount: 9800, method: 'העברה בנקאית', ref: 'חשבונית 2026-0044' },
    { id: 'R-2026-0034', date: '14.02.2026', amount: 7600, method: 'אשראי', ref: 'חשבונית 2026-0011' },
  ],
  'CL-1362': [
    { id: 'R-2026-0190', date: '24.04.2026', amount: 4400, method: 'אשראי', ref: 'חשבונית 2026-0166' },
    { id: 'R-2026-0118', date: '20.03.2026', amount: 3210, method: 'אשראי', ref: 'חשבונית 2026-0091' },
  ],
  'CL-1391': [{ id: 'R-2026-0186', date: '21.04.2026', amount: 410, method: 'אשראי', ref: 'חשבונית 2026-0163' }],
}

export const RECEIPTS_DEFAULT: Receipt[] = [{ id: 'R-2026-0181', date: '17.04.2026', amount: 980, method: 'העברה בנקאית', ref: 'חשבונית 2026-0181' }]

export type OrderKind = 'order' | 'repair'
export type OrderStatus = 'open' | 'in_progress' | 'ready' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  date: string
  due: string
  kind: OrderKind
  desc: string
  status: OrderStatus
  amount: number
}

export const ORDERS_BY_CLIENT: Record<string, Order[]> = {
  'CL-1042': [
    { id: 'O-4421', date: '06.05.2026', due: '12.05.2026', kind: 'order', desc: 'הזמנה #4421 — 6 פריטים', status: 'in_progress', amount: 4280 },
    { id: 'O-4408', date: '20.04.2026', due: '24.04.2026', kind: 'order', desc: 'הזמנה #4408 — 3 פריטים', status: 'delivered', amount: 1860 },
    { id: 'T-0089', date: '02.05.2026', due: '12.05.2026', kind: 'repair', desc: 'תיקון מחזיק כוסות — דגם פרימיום', status: 'in_progress', amount: 320 },
  ],
  'CL-1131': [
    { id: 'O-4458', date: '04.05.2026', due: '07.05.2026', kind: 'order', desc: 'הזמנה #4458 — 4 פריטים', status: 'ready', amount: 1820 },
    { id: 'T-0091', date: '28.04.2026', due: '06.05.2026', kind: 'repair', desc: 'תיקון מכונת אספרסו — דליפה', status: 'delivered', amount: 450 },
  ],
  'CL-1154': [
    { id: 'T-0093', date: '03.05.2026', due: '14.05.2026', kind: 'repair', desc: 'תיקון שרשרת זהב 14K — חוליה', status: 'in_progress', amount: 280 },
    { id: 'T-0084', date: '10.04.2026', due: '17.04.2026', kind: 'repair', desc: 'ליטוש טבעת אירוסין', status: 'delivered', amount: 180 },
    { id: 'O-4416', date: '14.04.2026', due: '14.04.2026', kind: 'order', desc: 'הזמנה #4416 — 2 פריטים', status: 'delivered', amount: 980 },
  ],
  'CL-1188': [{ id: 'O-4444', date: '02.05.2026', due: '06.05.2026', kind: 'order', desc: 'הזמנה #4444 — 4 פריטים', status: 'open', amount: 3420 }],
  'CL-1206': [{ id: 'T-0092', date: '01.05.2026', due: '08.05.2026', kind: 'repair', desc: 'תיקון מנורת קיר — נורה', status: 'ready', amount: 120 }],
  'CL-1219': [
    { id: 'O-4452', date: '07.05.2026', due: '12.05.2026', kind: 'order', desc: 'הזמנה #4452 — 8 פריטים', status: 'in_progress', amount: 2980 },
    { id: 'O-4438', date: '24.04.2026', due: '28.04.2026', kind: 'order', desc: 'הזמנה #4438 — 5 פריטים', status: 'delivered', amount: 1620 },
    { id: 'O-4421', date: '15.04.2026', due: '20.04.2026', kind: 'order', desc: 'הזמנה #4421 — 12 פריטים', status: 'delivered', amount: 3450 },
  ],
  'CL-1255': [
    { id: 'T-0090', date: '06.05.2026', due: '13.05.2026', kind: 'repair', desc: 'כיוון מסור תעשייתי', status: 'in_progress', amount: 680 },
    { id: 'O-4455', date: '02.05.2026', due: '08.05.2026', kind: 'order', desc: 'הזמנה #4455 — 3 פריטים', status: 'delivered', amount: 1880 },
  ],
  'CL-1312': [
    { id: 'O-4459', date: '05.05.2026', due: '10.05.2026', kind: 'order', desc: 'הזמנה #4459 — 14 פריטים', status: 'in_progress', amount: 12400 },
    { id: 'O-4451', date: '28.04.2026', due: '03.05.2026', kind: 'order', desc: 'הזמנה #4451 — 9 פריטים', status: 'delivered', amount: 8800 },
  ],
  'CL-1362': [
    { id: 'T-0094', date: '06.05.2026', due: '15.05.2026', kind: 'repair', desc: 'תיקון מקרר תעשייתי — קומפרסור', status: 'open', amount: 1250 },
    { id: 'O-4462', date: '08.05.2026', due: '12.05.2026', kind: 'order', desc: 'הזמנה #4462 — 5 פריטים', status: 'in_progress', amount: 2210 },
  ],
  'CL-1404': [{ id: 'T-0086', date: '20.04.2026', due: '04.05.2026', kind: 'repair', desc: 'שיקום מסגרת תמונה עתיקה', status: 'delivered', amount: 890 }],
}

export const ORDER_STATUS: Record<OrderStatus, { he: string; dot: 'b' | 'y' | 'g' | 'n' | 'r' }> = {
  open: { he: 'נפתח', dot: 'b' },
  in_progress: { he: 'בעבודה', dot: 'y' },
  ready: { he: 'מוכן לאיסוף', dot: 'g' },
  delivered: { he: 'נמסר', dot: 'n' },
  cancelled: { he: 'בוטל', dot: 'r' },
}

export const INVOICE_STATUS: Record<InvoiceStatus, { he: string; dot: 'b' | 'y' | 'g' | 'n' | 'r' }> = {
  open: { he: 'פתוחה', dot: 'b' },
  overdue: { he: 'בפיגור', dot: 'r' },
  paid: { he: 'שולמה', dot: 'g' },
  issued: { he: 'הוצאה', dot: 'n' },
}

export type Activity = { date: string; who: string; what: string }
export const ACTIVITY_BY_CLIENT: Record<string, Activity[]> = {
  'CL-1042': [
    { date: '07.05.2026 09:14', who: 'נועה ל.', what: 'נשלחה חשבונית 2026-0214 למייל' },
    { date: '06.05.2026 15:02', who: 'מערכת', what: 'הופקה קבלה R-2026-0152' },
    { date: '02.05.2026 10:40', who: 'נועה ל.', what: 'הוספה תווית VIP' },
    { date: '20.04.2026 11:20', who: 'יואב ק.', what: 'יצירת חשבונית 2026-0188' },
  ],
  'CL-1188': [
    { date: '06.05.2026 16:30', who: 'תמר ס.', what: 'שיחת תזכורת חוב — בוצעה' },
    { date: '02.05.2026 09:00', who: 'מערכת', what: 'חשבונית 2026-0203 בפיגור' },
  ],
}

export const ACTIVITY_DEFAULT: Activity[] = [
  { date: '06.05.2026 12:00', who: 'מערכת', what: 'הוצאה חשבונית' },
  { date: '02.05.2026 09:11', who: 'יואב ק.', what: 'עדכון פרטי קשר' },
]
