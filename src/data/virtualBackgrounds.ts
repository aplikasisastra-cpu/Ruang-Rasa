export interface VirtualBackground {
  id: string;
  name: string;
  type: 'none' | 'blur' | 'image';
  url?: string;
  previewColor?: string;
}

export const VIRTUAL_BACKGROUNDS: VirtualBackground[] = [
  {
    id: 'none',
    name: 'Tanpa Efek',
    type: 'none',
  },
  {
    id: 'blur',
    name: 'Buram (Blur)',
    type: 'blur',
  },
  {
    id: 'office',
    name: 'Kantor Modern',
    type: 'image',
    url: '/src/assets/images/bg_modern_office_1791392459353.jpg',
  },
  {
    id: 'nature',
    name: 'Taman Asri',
    type: 'image',
    url: '/src/assets/images/bg_nature_scenery_1791392471913.jpg',
  },
  {
    id: 'library',
    name: 'Perpustakaan Hangat',
    type: 'image',
    url: '/src/assets/images/bg_cozy_library_1791392484576.jpg',
  },
];
