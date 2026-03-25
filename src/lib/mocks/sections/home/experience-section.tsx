// src/lib/mocks/sections/home/experience-section.tsx
'use client';

import {
  IconBriefcase,
  IconCertificate,
  IconDeviceLaptop,
  IconMapPin,
  IconTool,
} from '@tabler/icons-react';
import Image from 'next/image';
import type { TimelineEntry } from 'src/components';
import { ExperienceItemsData } from './experience-data';

// ─── Reusable sub-components ───

const TechBadge = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 transition-colors duration-200 hover:bg-emerald-500/20'>
    {children}
  </span>
);

const InfoRow = ({
  icon: Icon,
  children,
  iconColor = 'text-emerald-700 dark:text-emerald-400',
}: {
  icon: typeof IconBriefcase;
  children: React.ReactNode;
  iconColor?: string;
}) => (
  <div className='flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300'>
    <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
    <span>{children}</span>
  </div>
);

const TechStack = ({ techs }: { techs: string[] }) => (
  <div className='flex flex-wrap items-center gap-2 pt-1'>
    <IconTool className='h-3.5 w-3.5 text-muted-foreground shrink-0' />
    {techs.map((tech) => (
      <TechBadge key={tech}>{tech}</TechBadge>
    ))}
  </div>
);

const ProjectImageGrid = ({
  images,
}: {
  images: { src: string; alt: string }[];
}) => (
  <div
    className={`grid gap-4 pt-2 ${
      images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
    }`}
  >
    {images.map((img, i) => (
      <div key={i} className='overflow-hidden rounded-lg group/img'>
        <Image
          src={img.src}
          alt={img.alt}
          width={600}
          height={250}
          className={`rounded-lg object-cover object-top shadow-sm transition-transform duration-500 group-hover/img:scale-105 ${
            images.length === 1 ? 'w-full sm:w-1/2' : 'h-full w-full'
          }`}
        />
      </div>
    ))}
  </div>
);

// ─── Build timeline entries from data ───

export const ExperienceItems: TimelineEntry[] = ExperienceItemsData.map(
  (item) => ({
    title: item.title,
    content: (
      <div className='space-y-3'>
        {/* Type-specific icon */}
        <InfoRow
          icon={
            item.title === 'Freelance Frontend Engineer'
              ? IconDeviceLaptop
              : item.type === 'education'
                ? IconCertificate
                : IconBriefcase
          }
          iconColor={
            item.type === 'education'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-700 dark:text-emerald-400'
          }
        >
          {item.company
            ? `${item.company} • ${item.period}`
            : item.period}
        </InfoRow>

        {/* Location if available */}
        {item.location && (
          <InfoRow icon={IconMapPin}>{item.location}</InfoRow>
        )}

        {/* Description */}
        <p className='text-sm leading-relaxed text-neutral-800 dark:text-neutral-200'>
          {item.description}
        </p>

        {/* Tech stack */}
        <TechStack techs={item.techs} />

        {/* Images if available */}
        {item.images && item.images.length > 0 && (
          <ProjectImageGrid images={item.images} />
        )}
      </div>
    ),
  }),
);