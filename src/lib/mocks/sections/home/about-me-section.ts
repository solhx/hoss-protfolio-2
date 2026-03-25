import {
	Award,
	Briefcase,
	Calendar,
	GraduationCap,
	LucideIcon,
	MapPin,
	User,
} from 'lucide-react';

export interface AboutMeDetail {
	icon: LucideIcon | null;
	text?: string;
	translateZ: string;
	isButton?: boolean;
}

export interface AboutMeCard {
	title: string;
	icon: LucideIcon;
	details: AboutMeDetail[];
}

export const AboutMeSectionData: AboutMeCard[] = [
	{
		title: 'Personal',
		icon: User,
		details: [
			{ icon: MapPin, text: 'Cairo, Egypt', translateZ: '50' },
			{
				icon: Calendar,
				text:
					String(
						new Date().getFullYear() - new Date('2003/11/8').getFullYear(),
					) + ' years old',
				translateZ: '40',
			},
			{ icon: Briefcase, text: 'Available to work', translateZ: '50' },
			{ icon: null, translateZ: '60', isButton: true },
		],
	},
	{
		title: 'Education',
		icon: GraduationCap,
		details: [
			{
				icon: GraduationCap,
				text: 'Faculty of Computer Science CSS Department',
				translateZ: '50',
			},
			{ icon: MapPin, text: 'Cairo, Egypt', translateZ: '40' },
			{ icon: Award, text: 'Very Good with Honor', translateZ: '50' },
			{ icon: Calendar, text: '2021 – 2025', translateZ: '40' },
		],
	},
];
