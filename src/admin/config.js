// Describes every editable thing in the admin panel.
// To add a field to a content table: add it in supabase (ALTER TABLE) and list it here.

const bool = { name: 'published', label: 'Published (visible on the website)', type: 'bool' };
const order = { name: 'sort_order', label: 'Order', type: 'number', help: 'Lower numbers appear first.' };

export const CONTENT = {
  board_members: {
    title: 'Executive Board',
    singular: 'member',
    columns: ['name', 'position'],
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true },
      { name: 'position', label: 'Official position', type: 'text', required: true },
      { name: 'bio', label: 'Short biography', type: 'textarea' },
      { name: 'photo_url', label: 'Photo', type: 'image', help: 'Portrait photo, ideally 4:5 (e.g. 800×1000).' },
      order,
      bool,
    ],
  },
  committees: {
    title: 'Committees',
    singular: 'committee',
    columns: ['abbreviation', 'name', 'chair'],
    fields: [
      { name: 'name', label: 'Committee name', type: 'text', required: true },
      { name: 'abbreviation', label: 'Abbreviation', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'mandate', label: 'Mandate', type: 'textarea' },
      { name: 'topics', label: 'Topics', type: 'textarea', help: 'One topic per line.' },
      { name: 'issues', label: 'Explanation of the issues', type: 'textarea' },
      { name: 'chair', label: 'Chair', type: 'text' },
      { name: 'vice_chair', label: 'Vice-Chair', type: 'text' },
      { name: 'guide_url', label: 'Background guide', type: 'file', help: 'Upload a PDF, or paste a link.' },
      order,
      bool,
    ],
  },
  announcements: {
    title: 'Announcements',
    singular: 'announcement',
    orderBy: 'created_at',
    ascending: false,
    columns: ['title', 'created_at'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'body', label: 'Text', type: 'textarea' },
      bool,
    ],
  },
  schedule_items: {
    title: 'Schedule',
    singular: 'schedule item',
    columns: ['day', 'start_time', 'title'],
    fields: [
      { name: 'day', label: 'Day', type: 'text', required: true, help: 'e.g. "Day 1"' },
      { name: 'start_time', label: 'Start time', type: 'text', help: 'e.g. 09:00' },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Details', type: 'textarea' },
      order,
      bool,
    ],
  },
  documents: {
    title: 'Handbook & documents',
    singular: 'document',
    columns: ['title', 'kind'],
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      {
        name: 'kind',
        label: 'Type',
        type: 'select',
        options: [
          ['handbook', 'Delegate Handbook'],
          ['background_guide', 'Background guide'],
          ['other', 'Other'],
        ],
      },
      { name: 'description', label: 'Short description', type: 'textarea' },
      { name: 'file_url', label: 'File', type: 'file', required: true, help: 'Upload a PDF, or paste a link.' },
      order,
      bool,
    ],
  },
  sponsors: {
    title: 'Sponsors & partners',
    singular: 'sponsor / partner',
    columns: ['name', 'kind'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      {
        name: 'kind',
        label: 'Type',
        type: 'select',
        options: [
          ['sponsor', 'Sponsor'],
          ['partner', 'Partner institution'],
        ],
      },
      { name: 'logo_url', label: 'Logo', type: 'image', help: 'Only upload logos you have permission to use.' },
      { name: 'website_url', label: 'Website', type: 'text', help: 'https://…' },
      order,
      bool,
    ],
  },
  faqs: {
    title: 'FAQ',
    singular: 'question',
    columns: ['category', 'question'],
    fields: [
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'category', label: 'Category', type: 'text', help: 'e.g. General, Registration, Fees, Committees' },
      order,
      bool,
    ],
  },
  staff_positions: {
    title: 'Staff positions',
    singular: 'position',
    columns: ['title', 'deadline'],
    fields: [
      { name: 'title', label: 'Position title', type: 'text', required: true },
      { name: 'description', label: 'Responsibilities', type: 'textarea' },
      { name: 'requirements', label: 'Requirements', type: 'textarea' },
      { name: 'deadline', label: 'Application deadline', type: 'date' },
      order,
      bool,
    ],
  },
};

const TRUE_FALSE = [
  ['true', 'Yes'],
  ['false', 'No'],
];

export const SETTINGS_GROUPS = [
  {
    title: 'Registration & fees',
    note: 'Dates use Damascus time and are inclusive (the whole last day counts). Leave all dates empty for a single flat "regular" fee.',
    fields: [
      { key: 'registration_enabled', label: 'Registration switched on', type: 'select', options: TRUE_FALSE },
      { key: 'registration_opens', label: 'Registration opens', type: 'date' },
      { key: 'early_bird_ends', label: 'Early bird ends', type: 'date' },
      { key: 'regular_ends', label: 'Regular fee ends', type: 'date' },
      { key: 'registration_closes', label: 'Registration closes', type: 'date', help: 'Late fee applies between "regular ends" and this date.' },
      { key: 'fee_early', label: 'Early bird fee (USD)', type: 'number' },
      { key: 'fee_regular', label: 'Regular fee (USD)', type: 'number' },
      { key: 'fee_late', label: 'Late fee (USD)', type: 'number' },
      { key: 'payment_instructions', label: 'Payment instructions', type: 'textarea', help: 'Shown to delegates after they apply.' },
    ],
  },
  {
    title: 'Conference',
    fields: [
      { key: 'conference_dates_text', label: 'Dates (as shown on the site)', type: 'text', help: 'e.g. "12–13 June 2027"' },
      { key: 'conference_start', label: 'First day (for the countdown)', type: 'date', help: 'Leave empty until the dates are confirmed.' },
      { key: 'venue_text', label: 'Location', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
    ],
  },
  {
    title: 'Contact & social media',
    fields: [
      { key: 'contact_email', label: 'Official email', type: 'text' },
      { key: 'instagram_url', label: 'Instagram link', type: 'text' },
      { key: 'tiktok_url', label: 'TikTok link', type: 'text' },
      { key: 'x_url', label: 'X (Twitter) link', type: 'text' },
      { key: 'linkedin_url', label: 'LinkedIn link', type: 'text' },
      { key: 'youtube_url', label: 'YouTube link', type: 'text' },
    ],
  },
  {
    title: 'Staff applications',
    fields: [
      { key: 'staff_applications_open', label: 'Accepting staff applications', type: 'select', options: TRUE_FALSE },
      { key: 'staff_intro', label: 'Intro text', type: 'textarea' },
    ],
  },
  {
    title: 'About page',
    fields: [
      { key: 'about_mission', label: 'Mission', type: 'textarea' },
      { key: 'about_vision', label: 'Vision', type: 'textarea' },
      { key: 'about_goals', label: 'Goals', type: 'textarea', help: 'One goal per line.' },
    ],
  },
  {
    title: 'Delegate information page',
    fields: [
      { key: 'what_is_mun', label: 'What is MUN?', type: 'textarea' },
      { key: 'who_can_participate', label: 'Who can participate?', type: 'textarea' },
      { key: 'what_happens', label: 'What happens at the conference?', type: 'textarea' },
      { key: 'what_to_prepare', label: 'What delegates should prepare', type: 'textarea', help: 'One item per line.' },
      { key: 'dress_code', label: 'Dress code', type: 'textarea' },
      { key: 'what_delegates_receive', label: 'What delegates will receive', type: 'textarea' },
    ],
  },
];

export const STATUS_LABEL = {
  received: 'Received',
  under_review: 'Under review',
  interview: 'Interview',
  accepted: 'Accepted',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const STATUS_STYLE = {
  received: 'bg-navy-100 text-navy-800',
  under_review: 'bg-amber-100 text-amber-800',
  interview: 'bg-sky-100 text-sky-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  waitlisted: 'bg-violet-100 text-violet-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-200 text-gray-700',
};

export const APPLICATIONS = {
  delegate: {
    table: 'delegate_applications',
    title: 'Delegate applications',
    statuses: ['received', 'under_review', 'accepted', 'waitlisted', 'rejected', 'withdrawn'],
    payment: true,
  },
  staff: {
    table: 'staff_applications',
    title: 'Staff & volunteer applications',
    statuses: ['received', 'under_review', 'interview', 'accepted', 'rejected', 'withdrawn'],
    payment: false,
  },
};

export const AGE_LABEL = { under_16: 'Under 16', '16_17': '16–17', '18_24': '18–24', '25_plus': '25 or older' };
export const EXP_LABEL = { none: 'First MUN', '1_2': '1–2 conferences', '3_plus': '3+ conferences' };
