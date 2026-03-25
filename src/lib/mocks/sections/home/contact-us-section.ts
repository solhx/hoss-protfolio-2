interface ContactUsItem {
	link: string;
	text: string;
	image: string;
}

export const ContactUsItems: ContactUsItem[] = [
	{
		link: 'https://api.whatsapp.com/send/?phone=%2B201022828316&text&type=phone_number&app_absent=0',
		text: 'WhatsApp',
		image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
	},
	{
		link: 'https://www.linkedin.com/in/hossam-hassan-132055244/',
		text: 'LinkedIn',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
	},
	{
		link: 'mailto:hossamhassan112003@gmail.com',
		text: 'Gmail',
		image: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png',
	},
	{
		link: 'https://github.com/solhx',
		text: 'GitHub',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
	},
];
