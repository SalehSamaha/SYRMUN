// All fixed website text, in English and Arabic.  Format:  key: ['English', 'العربية']
// Placeholders like {date} are filled in by t(key, { date }).
// Text that the team edits in the admin panel (committees, board, FAQ, settings...) is NOT here:
// it is stored in the database with an optional "_ar" Arabic version next to each field.

export const DICT = {
  // ---- navigation / layout ----
  'nav.about': ['About', 'عن المؤتمر'],
  'nav.committees': ['Committees', 'اللجان'],
  'nav.board': ['Executive Board', 'الهيئة التنفيذية'],
  'nav.delegates': ['Delegates', 'المندوبون'],
  'nav.staff': ['Join the Team', 'انضم إلى الفريق'],
  'nav.sponsors': ['Sponsors', 'الرعاة'],
  'nav.contact': ['Contact', 'تواصل معنا'],
  'nav.faq': ['FAQ', 'الأسئلة الشائعة'],
  'nav.register': ['Register', 'سجّل'],
  'nav.registerLong': ['Register as a delegate', 'سجّل كمندوب'],
  'nav.home': ['SYRMUN 2027 home', 'الصفحة الرئيسية لـ SYRMUN 2027'],
  'nav.main': ['Main', 'القائمة الرئيسية'],
  'nav.mobile': ['Mobile', 'قائمة الجوال'],
  'nav.openMenu': ['Open menu', 'فتح القائمة'],
  'nav.closeMenu': ['Close menu', 'إغلاق القائمة'],
  'lang.switchLabel': ['العربية', 'English'],
  'lang.switchAria': ['Switch to Arabic', 'التبديل إلى الإنجليزية'],
  'layout.skip': ['Skip to content', 'انتقل إلى المحتوى'],
  'layout.preview': [
    'Preview mode — no database connected, sample content is shown and nothing is saved.',
    'وضع المعاينة: لا توجد قاعدة بيانات متصلة، يُعرض محتوى تجريبي ولا يُحفظ شيء.',
  ],
  'footer.about': [
    'Syria Model United Nations — a two-day conference in {venue}, {dates}.',
    'نموذج الأمم المتحدة السوري، مؤتمر من يومين في {venue}، {dates}.',
  ],
  'footer.explore': ['Explore', 'استكشف'],
  'footer.contact': ['Contact', 'تواصل'],
  'footer.privacy': ['Privacy', 'الخصوصية'],
  'footer.copy': [
    '© {year} SYRMUN. SYRMUN is an independent Model United Nations conference and is not affiliated with the United Nations.',
    '© {year} SYRMUN. SYRMUN مؤتمر مستقل لنموذج الأمم المتحدة وليس تابعًا للأمم المتحدة.',
  ],

  // ---- shared words ----
  'phase.early': ['Early bird', 'التسجيل المبكر'],
  'phase.regular': ['Regular', 'التسجيل العادي'],
  'phase.late': ['Late', 'التسجيل المتأخر'],
  'common.delegateInfo': ['Delegate information', 'معلومات المندوبين'],
  'common.contactUs': ['Contact us', 'تواصل معنا'],
  'common.faq': ['FAQ', 'الأسئلة الشائعة'],
  'common.backHome': ['Back to home', 'العودة إلى الرئيسية'],
  'common.getInTouch': ['Get in touch', 'تواصل معنا'],
  'common.loading': ['Loading', 'جارٍ التحميل'],
  'common.joinTeam': ['Join the team', 'انضم إلى الفريق'],
  'common.backgroundGuide': ['Background guide', 'الدليل الخلفي'],
  'common.committees': ['Committees', 'اللجان'],
  'common.execBoard': ['Executive Board', 'الهيئة التنفيذية'],

  'countdown.days': ['Days', 'يوم'],
  'countdown.hours': ['Hours', 'ساعة'],
  'countdown.minutes': ['Minutes', 'دقيقة'],
  'countdown.seconds': ['Seconds', 'ثانية'],
  'countdown.soon': [
    'Countdown starts once the conference dates are confirmed',
    'يبدأ العدّ التنازلي فور تأكيد مواعيد المؤتمر',
  ],
  'countdown.aria': ['Time until the conference', 'الوقت المتبقي للمؤتمر'],

  // ---- home ----
  'home.metaDesc': [
    'SYRMUN 2027 is a two-day Model United Nations conference in Damascus, Syria, in 2027. An affordable, welcoming and professional MUN experience.',
    'SYRMUN 2027 مؤتمر نموذج الأمم المتحدة لمدة يومين في دمشق، سوريا، عام 2027. تجربة مناسبة التكلفة وودّية واحترافية.',
  ],
  'hero.sub': ['Syria Model United Nations', 'نموذج الأمم المتحدة السوري'],
  'hero.intro': [
    'A two-day Model United Nations conference bringing together around 40–60 delegates to debate, negotiate and collaborate.',
    'مؤتمر نموذج الأمم المتحدة لمدة يومين، يجمع نحو 40–60 مندوبًا للنقاش والتفاوض والعمل معًا.',
  ],
  'cta.open': ['Register as a delegate', 'سجّل كمندوب'],
  'cta.closed': ['Registration closed', 'التسجيل مغلق'],
  'cta.soon': ['Registration opening soon', 'التسجيل سيُفتح قريبًا'],
  'hero.learn': ['Learn about SYRMUN', 'تعرّف على SYRMUN'],
  'home.news': ['Latest announcements', 'آخر الإعلانات'],
  'home.what.eyebrow': ['What is SYRMUN?', 'ما هو SYRMUN؟'],
  'home.what.title': [
    'A first conference built to be welcoming, professional and affordable',
    'مؤتمر أول يتميّز بالترحيب والاحترافية وبتكلفة مناسبة',
  ],
  'home.what.intro': [
    'SYRMUN — the Syria Model United Nations — is a Model UN conference in Damascus. Delegates take on the roles of diplomats, research real issues and work together to find solutions, guided by the Executive Board.',
    'SYRMUN، أي نموذج الأمم المتحدة السوري، مؤتمر لمحاكاة الأمم المتحدة في دمشق. يتولّى المندوبون أدوار الدبلوماسيين، ويبحثون قضايا حقيقية، ويعملون معًا لإيجاد الحلول بإشراف الهيئة التنفيذية.',
  ],
  'why.1.t': ['Build real skills', 'اكتسب مهارات حقيقية'],
  'why.1.d': [
    'Public speaking, negotiation, research and writing — practised in a real committee setting.',
    'الخطابة والتفاوض والبحث والكتابة، تُمارَس داخل لجنة حقيقية.',
  ],
  'why.2.t': ['Welcoming to beginners', 'مرحّب بالمبتدئين'],
  'why.2.d': [
    'First conference? You are exactly who we are designing SYRMUN for.',
    'هذا أول مؤتمر لك؟ أنت بالضبط من نصمّم SYRMUN من أجله.',
  ],
  'why.3.t': ['Affordable', 'بتكلفة مناسبة'],
  'why.3.d': [
    'We are keeping fees low so that cost is not the reason someone misses out.',
    'نُبقي الرسوم منخفضة كي لا تكون التكلفة سببًا في أن يفوّت أحدٌ الفرصة.',
  ],
  'why.4.t': ['Professional', 'احترافي'],
  'why.4.d': [
    'Committees run by an Executive Board with clear rules of procedure.',
    'لجان تديرها هيئة تنفيذية وفق قواعد إجراءات واضحة.',
  ],
  'home.committees.title': ['Where the debate happens', 'حيث يدور النقاش'],
  'committees.empty.t': ['Committees will be announced soon', 'سيُعلن عن اللجان قريبًا'],
  'committees.empty.d': [
    'We are finalising the committees and topics. Check back here, or follow us on social media for the announcement.',
    'نعمل على وضع اللمسات الأخيرة على اللجان والمواضيع. عُد إلى هنا لاحقًا أو تابعنا على وسائل التواصل الاجتماعي.',
  ],
  'committees.view': ['View committee →', 'عرض اللجنة ←'],
  'committees.all': ['All committees', 'كل اللجان'],
  'exp.eyebrow': ['The experience', 'التجربة'],
  'exp.title': ['What delegates can expect', 'ماذا يتوقع المندوبون'],
  'exp.1.t': ['Two days of committee sessions', 'يومان من جلسات اللجان'],
  'exp.1.d': [
    'Formal debate, informal negotiation and resolution drafting.',
    'نقاش رسمي، وتفاوض غير رسمي، وصياغة القرارات.',
  ],
  'exp.2.t': ['Prepared with you', 'نجهّزك مسبقًا'],
  'exp.2.d': [
    'Background guides and a Delegate Handbook so you arrive ready.',
    'أدلة خلفية ودليل للمندوب لتصل وأنت مستعد.',
  ],
  'exp.3.t': ['Meet your fellow delegates', 'تعرّف على زملائك المندوبين'],
  'exp.3.d': [
    'Around 40–60 delegates in one room, working on shared problems.',
    'نحو 40–60 مندوبًا في قاعة واحدة يعملون على قضايا مشتركة.',
  ],
  'exp.4.t': ['In Damascus', 'في دمشق'],
  'exp.4.d': [
    'A two-day conference held in Damascus, Syria, in 2027.',
    'مؤتمر من يومين يُعقد في دمشق، سوريا، عام 2027.',
  ],
  'home.board.title': ['Meet the team running SYRMUN', 'تعرّف على الفريق الذي يدير SYRMUN'],
  'board.empty.t': ['Executive Board to be announced', 'ستُعلن الهيئة التنفيذية قريبًا'],
  'board.empty.d': ['We will introduce the team here soon.', 'سنعرّف بالفريق هنا قريبًا.'],
  'board.full': ['Full Executive Board', 'الهيئة التنفيذية كاملة'],
  'home.faq.title': ['Frequently asked questions', 'الأسئلة الشائعة'],
  'home.faq.all': ['See all questions', 'عرض كل الأسئلة'],
  'home.cta.title': ['Ready to be part of SYRMUN 2027?', 'هل أنت مستعد لتكون جزءًا من SYRMUN 2027؟'],
  'home.cta.text': [
    'Register as a delegate, or apply to join the organising team.',
    'سجّل كمندوب، أو قدّم طلبًا للانضمام إلى الفريق المنظِّم.',
  ],

  // ---- about ----
  'about.meta': [
    'The purpose, vision, mission and goals of SYRMUN, the Syria Model United Nations.',
    'غاية SYRMUN ورؤيته ورسالته وأهدافه، نموذج الأمم المتحدة السوري.',
  ],
  'about.eyebrow': ['About SYRMUN', 'عن SYRMUN'],
  'about.title': [
    'An affordable, welcoming and memorable MUN experience',
    'تجربة نموذج أمم متحدة مناسبة التكلفة وودّية ولا تُنسى',
  ],
  'about.intro': [
    'SYRMUN is the Syria Model United Nations — a two-day conference in Damascus, designed to be professional enough for experienced delegates and welcoming enough for people attending their first.',
    'SYRMUN هو نموذج الأمم المتحدة السوري، مؤتمر من يومين في دمشق، مصمَّم ليكون احترافيًا بما يكفي للمندوبين ذوي الخبرة، وودّيًا بما يكفي لمن يحضر مؤتمره الأول.',
  ],
  'about.mission': ['Our mission', 'رسالتنا'],
  'about.vision': ['Our vision', 'رؤيتنا'],
  'about.goals.eyebrow': ['Our goals', 'أهدافنا'],
  'about.goals.title': ['What we are working towards', 'ما نعمل من أجله'],
  'about.cta.title': ['Take part in the first SYRMUN', 'شارك في أول نسخة من SYRMUN'],
  'about.cta.text': [
    'Whether you are a seasoned delegate or this is your very first conference, there is a place for you.',
    'سواء كنت مندوبًا متمرّسًا أو كان هذا مؤتمرك الأول، فهناك مكان لك.',
  ],

  // ---- board ----
  'boardpage.meta': ['Meet the Executive Board organising SYRMUN 2027.', 'تعرّف على الهيئة التنفيذية المنظِّمة لـ SYRMUN 2027.'],
  'boardpage.title': ['The people behind SYRMUN', 'الأشخاص وراء SYRMUN'],
  'boardpage.intro': [
    'The Executive Board plans the conference, chairs the committees and makes sure every delegate has a great experience.',
    'تخطّط الهيئة التنفيذية للمؤتمر، وترأس اللجان، وتحرص على أن يحظى كل مندوب بتجربة رائعة.',
  ],
  'board.photoAlt': ['Portrait of {name}', 'صورة {name}'],

  // ---- committees page ----
  'cp.meta': ['The committees, topics and background guides for SYRMUN 2027.', 'لجان SYRMUN 2027 ومواضيعها وأدلتها الخلفية.'],
  'cp.title': ['Committees & topics', 'اللجان والمواضيع'],
  'cp.intro': [
    'Every committee at SYRMUN 2027, with its mandate, topics and Chairs. Background guides are linked here as soon as they are published.',
    'جميع لجان SYRMUN 2027 مع صلاحياتها ومواضيعها ورؤسائها. تُضاف روابط الأدلة الخلفية هنا فور نشرها.',
  ],
  'cp.about': ['About the committee', 'عن اللجنة'],
  'cp.mandate': ['Mandate', 'الصلاحيات'],
  'cp.topics': ['Topics', 'المواضيع'],
  'cp.topic': ['Topic', 'الموضوع'],
  'cp.issues': ['The issues', 'القضايا'],
  'cp.chair': ['Chair', 'الرئيس'],
  'cp.vice': ['Vice-Chair', 'نائب الرئيس'],
  'cp.chairsTbc': ['Chairs to be confirmed.', 'سيُعلن عن رئاسة اللجنة لاحقًا.'],
  'cp.guideSoon': ['Background guide coming soon.', 'الدليل الخلفي قريبًا.'],

  // ---- delegates page ----
  'dp.meta': [
    'Everything delegates need to know about SYRMUN 2027: preparation, dress code, schedule, fees and materials.',
    'كل ما يحتاج المندوبون إلى معرفته عن SYRMUN 2027: التحضير وقواعد اللباس والجدول والرسوم والمواد.',
  ],
  'dp.title': ['Everything you need to know before you register', 'كل ما تحتاج إلى معرفته قبل التسجيل'],
  'dp.intro': [
    'What to expect, how to prepare, what it costs and where to find your materials.',
    'ماذا تتوقع، وكيف تستعد، وكم التكلفة، وأين تجد موادك.',
  ],
  'dp.what': ['What is MUN?', 'ما هو نموذج الأمم المتحدة؟'],
  'dp.who': ['Who can participate?', 'من يمكنه المشاركة؟'],
  'dp.happens': ['What happens at the conference?', 'ماذا يحدث في المؤتمر؟'],
  'dp.prepare': ['What should delegates prepare?', 'ماذا على المندوب أن يُعدّ؟'],
  'dp.dress': ['Dress code', 'قواعد اللباس'],
  'dp.receive': ['What delegates will receive', 'ماذا سيحصل عليه المندوبون'],
  'dp.fees': ['Registration fees & deadlines', 'رسوم التسجيل والمواعيد النهائية'],
  'dp.opens': ['Registration opens {date}.', 'يُفتح التسجيل في {date}.'],
  'dp.datesSoon': ['Registration dates will be confirmed soon.', 'ستُعلن مواعيد التسجيل قريبًا.'],
  'dp.inclusive': ['Dates are inclusive and use Damascus time.', 'المواعيد شاملة ليوم النهاية وبتوقيت دمشق.'],
  'dp.until': ['until {date}', 'حتى {date}'],
  'dp.tbc': ['dates to be confirmed', 'المواعيد لاحقًا'],
  'dp.current': ['Current price', 'السعر الحالي'],
  'dp.registerNow': ['Register now', 'سجّل الآن'],
  'dp.regStatus': ['See registration status', 'حالة التسجيل'],
  'dp.schedule': ['Conference schedule', 'جدول المؤتمر'],
  'dp.schedule.t': ['Schedule to be confirmed', 'سيُعلن الجدول لاحقًا'],
  'dp.schedule.d': [
    'The full schedule will be published here as soon as it is confirmed.',
    'سيُنشر الجدول الكامل هنا فور اعتماده.',
  ],
  'dp.docs': ['Handbook & materials', 'الدليل والمواد'],
  'dp.docs.t': ['Materials coming soon', 'المواد قريبًا'],
  'dp.docs.d': [
    'The Delegate Handbook and other approved materials will be available to download here when they are ready.',
    'سيتوفر دليل المندوب وسائر المواد المعتمدة للتنزيل هنا عند جاهزيتها.',
  ],
  'dp.kind.handbook': ['Delegate Handbook', 'دليل المندوب'],
  'dp.kind.background_guide': ['Background guide', 'الدليل الخلفي'],
  'dp.kind.other': ['Document', 'مستند'],
  'dp.question.t': ['Still have a question?', 'لديك سؤال آخر؟'],
  'dp.question.d': [
    'Check the FAQ or get in touch with the organising team.',
    'اطّلع على الأسئلة الشائعة أو تواصل مع الفريق المنظِّم.',
  ],

  // ---- register ----
  'reg.meta': ['Register as a delegate for SYRMUN 2027.', 'سجّل كمندوب في SYRMUN 2027.'],
  'reg.eyebrow': ['Delegate registration', 'تسجيل المندوبين'],
  'reg.title': ['Register for SYRMUN 2027', 'سجّل في SYRMUN 2027'],
  'reg.intro': [
    'It takes about two minutes. We only ask for what we need to run the conference.',
    'يستغرق نحو دقيقتين. نطلب فقط ما نحتاجه لتنظيم المؤتمر.',
  ],
  'reg.notopen.t': ['Registration is not open yet', 'التسجيل لم يُفتح بعد'],
  'reg.notopen.date': [
    'Registration opens on {date}. Follow our social media to hear first.',
    'يُفتح التسجيل في {date}. تابعنا على وسائل التواصل لتكون أول من يعلم.',
  ],
  'reg.notopen.nodate': [
    'Registration will open soon. Follow our social media to hear first.',
    'سيُفتح التسجيل قريبًا. تابعنا على وسائل التواصل لتكون أول من يعلم.',
  ],
  'reg.closed.t': ['Registration is closed', 'التسجيل مغلق'],
  'reg.closed.d': [
    'Thank you for your interest in SYRMUN 2027. If you have a question, please get in touch.',
    'شكرًا لاهتمامك بـ SYRMUN 2027. إن كان لديك سؤال فتواصل معنا.',
  ],
  'reg.ok.t': ['Application received', 'تم استلام طلبك'],
  'reg.ok.thanks': [
    'Thank you — we have received your application for SYRMUN 2027.',
    'شكرًا لك، لقد استلمنا طلبك للمشاركة في SYRMUN 2027.',
  ],
  'reg.ok.notAccepted': ['Received is not the same as accepted.', 'الاستلام لا يعني القبول.'],
  'reg.ok.body1': [
    'Your place is not confirmed yet. The organising team will review your application and contact you at',
    'مقعدك لم يتأكد بعد. سيراجع الفريق المنظِّم طلبك ويتواصل معك على البريد',
  ],
  'reg.ok.body2': ['once a decision has been made.', 'عند اتخاذ القرار.'],
  'reg.ok.ref': ['Your reference', 'رقم مرجعك'],
  'reg.ok.refHint': ['Keep this if you contact us about your application.', 'احتفظ به عند التواصل معنا بخصوص طلبك.'],
  'reg.ok.fee': ['Fee ({label})', 'الرسوم ({label})'],
  'reg.ok.feeHint': ['Payable only after your application is accepted.', 'تُدفع فقط بعد قبول طلبك.'],
  'reg.ok.payment': ['Payment', 'الدفع'],
  'reg.feeBox': [
    'Current fee: {amount} ({label}). Nothing is paid now — you will be told how to pay once your application has been accepted.',
    'الرسوم الحالية: {amount} ({label}). لا يُدفع شيء الآن، وسنخبرك بطريقة الدفع بعد قبول طلبك.',
  ],
  'f.fullName': ['Full name', 'الاسم الكامل'],
  'f.email': ['Email address', 'البريد الإلكتروني'],
  'f.emailHint': ['We will use this to contact you about your application.', 'سنستخدمه للتواصل معك بخصوص طلبك.'],
  'f.institution': ['School or institution', 'المدرسة أو المؤسسة'],
  'f.institutionHint': ['Leave blank if not applicable.', 'اتركه فارغًا إن لم ينطبق.'],
  'f.age': ['Age group', 'الفئة العمرية'],
  'f.experience': ['Previous MUN experience', 'الخبرة السابقة في نموذج الأمم المتحدة'],
  'f.select': ['Select…', 'اختر…'],
  'f.pref1': ['First committee preference', 'اللجنة المفضّلة الأولى'],
  'f.pref2': ['Second committee preference', 'اللجنة المفضّلة الثانية'],
  'f.noPref': ['No preference', 'بلا تفضيل'],
  'f.notes': ['Anything else we should know?', 'هل هناك أي شيء آخر نحتاج إلى معرفته؟'],
  'f.notesHint': [
    'Optional. Please do not include sensitive personal information.',
    'اختياري. يُرجى عدم إدخال معلومات شخصية حساسة.',
  ],
  'f.consent1': [
    'I agree that SYRMUN may store the information I submit in order to process my application, as described on the',
    'أوافق على أن يحتفظ SYRMUN بالمعلومات التي أقدّمها لمعالجة طلبي، كما هو موضّح في',
  ],
  'f.privacyPage': ['Privacy page', 'صفحة الخصوصية'],
  'f.submit': ['Submit application', 'إرسال الطلب'],
  'f.sending': ['Sending…', 'جارٍ الإرسال…'],
  'age.under_16': ['Under 16', 'أقل من 16'],
  'age.16_17': ['16–17', '16–17'],
  'age.18_24': ['18–24', '18–24'],
  'age.25_plus': ['25 or older', '25 فأكثر'],
  'exp.none': ['This is my first MUN', 'هذا أول مؤتمر لي'],
  'exp.1_2': ['1–2 conferences', 'مؤتمر أو مؤتمران'],
  'exp.3_plus': ['3 or more conferences', '3 مؤتمرات أو أكثر'],
  'err.name': ['Please enter your full name.', 'يُرجى إدخال اسمك الكامل.'],
  'err.email': ['Please enter a valid email address.', 'يُرجى إدخال بريد إلكتروني صحيح.'],
  'err.consent': [
    'Please tick the box to confirm you agree to us storing your details.',
    'يُرجى تحديد المربع لتأكيد موافقتك على حفظ بياناتك.',
  ],
  'err.position': [
    'Please choose or enter the position you are applying for.',
    'يُرجى اختيار الوظيفة التي تتقدّم لها أو كتابتها.',
  ],
  'err.dupDelegate': [
    'An application has already been submitted with this email address. If you need to change something, please contact us.',
    'سبق تقديم طلب بهذا البريد الإلكتروني. إن أردت تعديل شيء فتواصل معنا.',
  ],
  'err.dupStaff': [
    'An application for this position has already been submitted with this email address.',
    'سبق تقديم طلب لهذه الوظيفة بهذا البريد الإلكتروني.',
  ],
  'err.notOpen': ['Registration is not open yet.', 'التسجيل لم يُفتح بعد.'],
  'err.closed': ['Registration is now closed.', 'التسجيل مغلق الآن.'],
  'err.staffClosed': ['Staff applications are currently closed.', 'باب التقديم للفريق مغلق حاليًا.'],
  'err.invalid': [
    'Some of the information you entered is not valid. Please check the form and try again.',
    'بعض المعلومات التي أدخلتها غير صحيحة. يُرجى مراجعة النموذج والمحاولة مجددًا.',
  ],
  'err.generic': [
    'Something went wrong and your application was not sent. Please try again in a moment, or contact us if it keeps happening.',
    'حدث خطأ ولم يُرسل طلبك. حاول مجددًا بعد قليل، أو تواصل معنا إن تكرّر ذلك.',
  ],

  // ---- staff ----
  'st.meta': [
    'Apply to join the SYRMUN 2027 secretariat and volunteer team.',
    'قدّم طلبك للانضمام إلى أمانة SYRMUN 2027 وفريق المتطوعين.',
  ],
  'st.eyebrow': ['Secretariat & staff', 'الأمانة والطاقم'],
  'st.title': ['Help us run SYRMUN', 'ساعدنا في تنظيم SYRMUN'],
  'st.open': ['Open positions', 'الوظائف المتاحة'],
  'st.empty.t': ['Positions will be announced soon', 'ستُعلن الوظائف قريبًا'],
  'st.empty.d': [
    'We will list the available roles, responsibilities and deadlines here.',
    'سنعرض هنا الأدوار المتاحة ومسؤولياتها ومواعيدها.',
  ],
  'st.applyBy': ['Apply by {date}', 'قدّم قبل {date}'],
  'st.resp': ['Responsibilities', 'المسؤوليات'],
  'st.req': ['Requirements', 'المتطلبات'],
  'st.apply': ['Apply', 'قدّم الآن'],
  'st.ok.body1': ['Thank you. We will review your application and contact you at', 'شكرًا لك. سنراجع طلبك ونتواصل معك على البريد'],
  'st.ok.body2': [
    'Receiving your application does not mean you have been accepted.',
    'استلام طلبك لا يعني قبوله.',
  ],
  'st.ok.ref': ['Reference:', 'المرجع:'],
  'st.closed.t': ['Staff applications are closed', 'باب التقديم للفريق مغلق'],
  'st.closed.d': [
    'Thank you for your interest. Please contact us if you would still like to help.',
    'شكرًا لاهتمامك. تواصل معنا إن كنت لا تزال ترغب في المساعدة.',
  ],
  'st.position': ['Position', 'الوظيفة'],
  'st.selectPos': ['Select a position…', 'اختر وظيفة…'],
  'st.general': ['General volunteer', 'متطوّع عام'],
  'st.placeholder': ['e.g. General volunteer', 'مثال: متطوّع عام'],
  'st.exp': ['Relevant experience', 'الخبرة ذات الصلة'],
  'st.expHint': [
    'MUN, organising events, volunteering, design, writing… (max 1500 characters)',
    'نموذج الأمم المتحدة، تنظيم الفعاليات، التطوع، التصميم، الكتابة… (بحد أقصى 1500 حرف)',
  ],
  'st.why': ['Why would you like to join the team?', 'لماذا ترغب في الانضمام إلى الفريق؟'],
  'st.avail': ['Availability', 'التوفّر'],
  'st.availHint': [
    'When can you work with the team before and during the conference?',
    'متى يمكنك العمل مع الفريق قبل المؤتمر وأثناءه؟',
  ],

  // ---- sponsors ----
  'sp.meta': [
    'The sponsors and partner institutions supporting SYRMUN 2027.',
    'الرعاة والمؤسسات الشريكة الداعمة لـ SYRMUN 2027.',
  ],
  'sp.eyebrow': ['Sponsors & partners', 'الرعاة والشركاء'],
  'sp.title': ['The organisations supporting SYRMUN', 'الجهات الداعمة لـ SYRMUN'],
  'sp.intro': [
    'SYRMUN is a first-year conference. Sponsors and partner institutions help us keep it affordable and make it possible for more students to take part.',
    'SYRMUN مؤتمر في عامه الأول. يساعدنا الرعاة والمؤسسات الشريكة على إبقائه بتكلفة مناسبة وعلى إتاحة المشاركة لعدد أكبر من الطلاب.',
  ],
  'sp.empty.t': ['Partners to be announced', 'سيُعلن عن الشركاء قريبًا'],
  'sp.empty.d': [
    'We will list our sponsors and partner institutions here as partnerships are confirmed.',
    'سنعرض هنا رعاتنا والمؤسسات الشريكة فور تأكيد الشراكات.',
  ],
  'sp.sponsors': ['Sponsors', 'الرعاة'],
  'sp.partners': ['Partner institutions', 'المؤسسات الشريكة'],
  'sp.cta.t': ['Would your organisation like to support SYRMUN?', 'هل ترغب مؤسستك في دعم SYRMUN؟'],
  'sp.cta.d': [
    'We would be glad to talk about sponsorship, partnerships with schools and institutions, or other ways to help.',
    'يسعدنا الحديث عن الرعاية والشراكات مع المدارس والمؤسسات أو أي طريقة أخرى للدعم.',
  ],
  'sp.emailUs': ['Email us', 'راسلنا'],
  'sp.newTab': ['{name} (opens in a new tab)', '{name} (يفتح في تبويب جديد)'],

  // ---- faq ----
  'faq.meta': [
    'Frequently asked questions about registering for and attending SYRMUN 2027.',
    'الأسئلة الشائعة حول التسجيل في SYRMUN 2027 وحضوره.',
  ],
  'faq.title': ['Frequently asked questions', 'الأسئلة الشائعة'],
  'faq.intro': [
    'Registration, fees, committees, preparation and more. Can’t find your answer? Get in touch.',
    'التسجيل والرسوم واللجان والتحضير وغيرها. لم تجد إجابتك؟ تواصل معنا.',
  ],
  'faq.general': ['General', 'عام'],
  'faq.empty.t':['No questions yet', 'لا توجد أسئلة بعد'],
  'faq.empty.d': ['Please contact us if you have a question.', 'تواصل معنا إن كان لديك سؤال.'],

  // ---- contact ----
  'ct.meta': ['Contact the SYRMUN 2027 organising team.', 'تواصل مع الفريق المنظِّم لـ SYRMUN 2027.'],
  'ct.title': ['Get in touch', 'ابقَ على تواصل'],
  'ct.intro': [
    'Questions about registration, committees, partnerships or anything else — we are happy to help.',
    'أسئلة عن التسجيل أو اللجان أو الشراكات أو أي شيء آخر، يسعدنا مساعدتك.',
  ],
  'ct.email': ['Email', 'البريد الإلكتروني'],
  'ct.noEmail': [
    'Our official email address will be published here soon. In the meantime, message us on Instagram.',
    'سننشر بريدنا الرسمي هنا قريبًا. وفي الأثناء راسلنا عبر إنستغرام.',
  ],
  'ct.reply': [
    'We reply as soon as we can. For registration questions, please include your reference number.',
    'نردّ في أقرب وقت ممكن. وفي أسئلة التسجيل يُرجى ذكر رقم المرجع.',
  ],
  'ct.follow': ['Follow SYRMUN', 'تابع SYRMUN'],
  'ct.noSocial': ['Social links coming soon.', 'روابط التواصل الاجتماعي قريبًا.'],
  'ct.announce': [
    'Announcements are posted on our social channels as well as on this website.',
    'تُنشر الإعلانات على قنواتنا الاجتماعية وعلى هذا الموقع.',
  ],
  'ct.quick.t': ['Looking for a quick answer?', 'تبحث عن إجابة سريعة؟'],
  'ct.quick.d': [
    'Many common questions are answered in the FAQ and on the delegate information page.',
    'تجد إجابات كثير من الأسئلة الشائعة في صفحة الأسئلة الشائعة وصفحة معلومات المندوبين.',
  ],

  // ---- privacy ----
  'pv.meta': [
    'How SYRMUN collects, uses and protects the personal information you submit.',
    'كيف يجمع SYRMUN المعلومات الشخصية التي تقدّمها ويستخدمها ويحميها.',
  ],
  'pv.eyebrow': ['Privacy', 'الخصوصية'],
  'pv.title': ['How we handle your information', 'كيف نتعامل مع معلوماتك'],
  'pv.1.t': ['What we collect', 'ما الذي نجمعه'],
  'pv.1.d': [
    'When you register as a delegate or apply to join the team we collect only what we need to run the conference: your name, email address, and — if you choose to give them — your school or institution, age group, committee preferences, MUN experience and any notes you add. Staff applications also include your experience, motivation and availability.',
    'عند تسجيلك كمندوب أو تقدّمك للانضمام إلى الفريق، نجمع فقط ما نحتاجه لتنظيم المؤتمر: اسمك وبريدك الإلكتروني، وإن شئت مدرستك أو مؤسستك وفئتك العمرية وتفضيلاتك للجان وخبرتك في نموذج الأمم المتحدة وأي ملاحظات تضيفها. وتتضمن طلبات الانضمام إلى الفريق أيضًا خبرتك ودوافعك وأوقات توفّرك.',
  ],
  'pv.2.t': ['How we use it', 'كيف نستخدمها'],
  'pv.2.d': [
    'We use your information to review your application, contact you about it, allocate committees and organise the conference. We do not sell your information and we do not use it for advertising.',
    'نستخدم معلوماتك لمراجعة طلبك والتواصل معك بشأنه وتوزيع اللجان وتنظيم المؤتمر. لا نبيع معلوماتك ولا نستخدمها في الإعلانات.',
  ],
  'pv.3.t': ['Who can see it', 'من يمكنه الاطلاع عليها'],
  'pv.3.d': [
    'Applications are stored in a private database. They are not shown on this website and can only be viewed by members of the SYRMUN organising team who have an administrator account.',
    'تُحفظ الطلبات في قاعدة بيانات خاصة، ولا تظهر على هذا الموقع، ولا يطّلع عليها إلا أعضاء الفريق المنظِّم لـ SYRMUN الذين لديهم حساب مسؤول.',
  ],
  'pv.4.t': ['How long we keep it', 'مدة الاحتفاظ بها'],
  'pv.4.d': [
    'We keep application data until the conference and any follow-up have finished, and then delete or anonymise it. You can ask us to delete your information earlier at any time.',
    'نحتفظ ببيانات الطلبات حتى انتهاء المؤتمر وأي متابعة لاحقة، ثم نحذفها أو نجعلها مجهولة الهوية. ويمكنك أن تطلب حذف معلوماتك قبل ذلك في أي وقت.',
  ],
  'pv.5.t': ['Your choices', 'خياراتك'],
  'pv.5.d': [
    'You can ask to see, correct or delete the information we hold about you.',
    'يمكنك أن تطلب الاطلاع على المعلومات التي نحتفظ بها عنك أو تصحيحها أو حذفها.',
  ],
  'pv.5.email': ['Email us at', 'راسلنا على'],
  'pv.5.page': ['Use the contact details on our Contact page.', 'استخدم بيانات التواصل في صفحة «تواصل معنا».'],

  // ---- 404 ----
  'nf.title': ['Page not found', 'الصفحة غير موجودة'],
  'nf.text': [
    'The page you are looking for does not exist or has moved.',
    'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  ],
  'nf.back': ['Back to the homepage', 'العودة إلى الصفحة الرئيسية'],
};

export const LANGS = ['en', 'ar'];

/** t(lang, key, params) with fallback: other language, then the key itself. */
export function translate(lang, key, params) {
  const pair = DICT[key];
  let s = pair ? pair[lang === 'ar' ? 1 : 0] || pair[0] : key;
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (params[k] != null ? String(params[k]) : m));
  return s;
}

/** Arabic version of a database row's field, falling back to English when none was entered. */
export function pickField(row, field, lang) {
  if (!row) return '';
  if (lang === 'ar') {
    const v = row[`${field}_ar`];
    if (v != null && String(v).trim() !== '') return v;
  }
  return row[field] ?? '';
}

/** Same idea for the key/value settings table (key "x" has an Arabic twin "x_ar"). */
export function pickSetting(settings, key, lang) {
  return pickField(settings, key, lang);
}

export const dateLocale = (lang) => (lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB');
