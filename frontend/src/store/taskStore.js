export const CATEGORY_CONFIG = {
  design_system: { label: 'DESIGN SYSTEM', color: 'bg-badge-green' },
  development: { label: 'DEVELOPMENT', color: 'bg-badge-red' },
  typography: { label: 'TYPOGRAPHY', color: 'bg-badge-blue' },
};

export const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-orange-400',
  'bg-green-500',
  'bg-pink-500',
  'bg-purple-500',
  'bg-yellow-500',
  'bg-teal-500',
  'bg-red-500',
];

export const defaultTasks = [
  {
    id: '1',
    title: 'Hero section',
    description: 'Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.',
    status: 'todo',
    category: 'design_system',
    assignees: [
      { initials: 'VH', color: 'bg-blue-600' },
      { initials: 'AG', color: 'bg-orange-400' },
    ],
  },
  {
    id: '2',
    title: 'Typography change',
    description: 'Modify typography and styling of text placed on 6 screens of the website design. Prepare a documentation.',
    status: 'todo',
    category: 'typography',
    assignees: [{ initials: 'ML', color: 'bg-purple-500' }],
  },
  {
    id: '3',
    title: 'Implement design screens',
    description: 'Our designers created 6 screens for a website that needs to be implemented by our dev team.',
    status: 'in_progress',
    category: 'development',
    assignees: [
      { initials: 'VH', color: 'bg-blue-600' },
      { initials: 'LK', color: 'bg-green-500' },
    ],
  },
  {
    id: '4',
    title: 'Fix bugs in the CSS code',
    description: 'Fix small bugs that are essential to prepare for the next release that will happen this quarter.',
    status: 'done',
    category: 'development',
    assignees: [
      { initials: 'HU', color: 'bg-pink-500' },
      { initials: 'NL', color: 'bg-yellow-500' },
    ],
  },
  {
    id: '5',
    title: 'Proofread final text',
    description: 'The text provided by marketing department needs to be proofread so that we make sure that it fits into our design.',
    status: 'done',
    category: 'typography',
    assignees: [{ initials: 'AG', color: 'bg-orange-400' }],
  },
  {
    id: '6',
    title: 'Responsive design',
    description: 'All designs need to be responsive. The requirement is that it fits all web and mobile screens.',
    status: 'done',
    category: 'design_system',
    assignees: [
      { initials: 'VH', color: 'bg-blue-600' },
      { initials: 'AG', color: 'bg-orange-400' },
    ],
  },
];
