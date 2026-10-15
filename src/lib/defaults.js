// Fallback text used until the team edits it in Admin > Settings.
// Anything marked CONFIRM should be checked/changed by the organising team.

export const DEFAULT_SETTINGS = {
  // --- Conference ---
  tagline:
    'An affordable, welcoming and professional Model United Nations experience — including for first-time delegates.',
  conference_dates_text: 'June 2027 · dates to be confirmed',
  conference_start: '', // YYYY-MM-DD, enables the countdown
  venue_text: 'Damascus, Syria',
  contact_email: '',
  instagram_url: 'https://www.instagram.com/syrmun/',
  tiktok_url: '',
  x_url: '',
  linkedin_url: '',
  youtube_url: '',

  // --- Registration ---
  registration_enabled: 'true',
  registration_opens: '',
  early_bird_ends: '',
  regular_ends: '',
  registration_closes: '',
  fee_early: '10',
  fee_regular: '12',
  fee_late: '15',
  payment_instructions:
    'Payment instructions will be sent to you by the organising team once your application has been reviewed.', // CONFIRM
  staff_applications_open: 'true',
  staff_intro:
    'SYRMUN is run by a volunteer team. If you would like to help organise the conference, see the open positions below and apply — staff applications are reviewed separately from delegate registration.',

  // --- About ---
  about_mission:
    'To provide an affordable, welcoming, professional and memorable Model United Nations experience in Damascus — including for people attending their very first conference.',
  about_vision:
    'A conference that makes delegates, schools and partners take Model UN in Syria seriously: well organised, academically rigorous and open to newcomers.',
  about_goals:
    'Keep participation affordable\nWelcome first-time delegates with proper preparation and support\nRun committees professionally, with trained chairs and clear rules of procedure\nBuild lasting connections between students and institutions\nLay the foundation for SYRMUN to grow every year',

  // --- Delegate information ---
  what_is_mun:
    'Model United Nations (MUN) is an educational simulation in which participants act as delegates representing countries or organisations. In committees, delegates research a topic, debate, negotiate with one another and work together to draft resolutions — building public speaking, diplomacy, research and writing skills along the way.',
  who_can_participate:
    'Students and young people who are interested in diplomacy, debate and international affairs. No previous MUN experience is required. Age and eligibility details will be confirmed by the organising team.', // CONFIRM
  what_happens:
    'SYRMUN 2027 runs over two days. Delegates take part in committee sessions chaired by the Executive Board, including formal debate, informal negotiation and the drafting and voting of resolutions. The full schedule will be published once it is confirmed.',
  what_to_prepare:
    'Read your committee’s background guide\nResearch the country or position you are assigned\nPrepare an opening statement\nBecome familiar with the rules of procedure in the Delegate Handbook',
  dress_code:
    'Formal / business attire. Details will be confirmed by the organising team.', // CONFIRM
  what_delegates_receive:
    'The list of what delegates receive will be confirmed by the organising team and published here before registration closes.', // CONFIRM
};

// Sample content shown ONLY in preview mode (no Supabase configured).
// It never appears on the live site.
export const SAMPLE = {
  committees: [
    {
      id: 's1',
      name: 'Sample Committee One',
      abbreviation: 'SC1',
      description: 'This is placeholder text that shows how a committee will look once real content is added in the admin panel.',
      mandate: 'Sample mandate: what this committee can and cannot do.',
      topics: 'Sample topic A\nSample topic B',
      issues: 'A short explanation of the issues delegates will debate goes here.',
      chair: 'To be confirmed',
      vice_chair: 'To be confirmed',
      guide_url: '',
    },
    {
      id: 's2',
      name: 'Sample Committee Two',
      abbreviation: 'SC2',
      description: 'Another placeholder committee, so you can preview the grid layout.',
      mandate: '',
      topics: 'Sample topic C',
      issues: '',
      chair: '',
      vice_chair: '',
      guide_url: '',
    },
  ],
  board_members: [
    { id: 'b1', name: 'Sample Name', position: 'Secretary-General', bio: 'A short biography appears here.', photo_url: '' },
    { id: 'b2', name: 'Sample Name', position: 'Deputy Secretary-General', bio: '', photo_url: '' },
    { id: 'b3', name: 'Sample Name', position: 'Director of Logistics', bio: '', photo_url: '' },
  ],
  faqs: [
    { id: 'f1', category: 'General', question: 'What is SYRMUN?', answer: 'SYRMUN is the Syria Model United Nations: a two-day Model UN conference taking place in Damascus, Syria in June 2027.' },
    { id: 'f2', category: 'Registration', question: 'Do I need previous MUN experience?', answer: 'No. SYRMUN is designed to be welcoming to first-time delegates as well as experienced ones.' },
    { id: 'f3', category: 'Registration', question: 'Is “application received” the same as “accepted”?', answer: 'No. “Received” means we have your application. You are only confirmed once the organising team marks it as accepted.' },
  ],
  announcements: [
    { id: 'a1', title: 'Sample announcement', body: 'Announcements published from the admin panel appear on the homepage.', created_at: '2026-10-14T09:00:00Z' },
  ],
  sponsors: [],
  staff_positions: [
    { id: 'p1', title: 'Sample position', description: 'What the role involves.', requirements: 'What we are looking for.', deadline: null },
  ],
  documents: [],
  schedule_items: [],
};
