export const errorToastOptions = {
	duration: 0,
	overlay: true,
	closeOnClickOverlay: true,
	className: 'w-[80vw]',
}

export function showLoading() {
	showLoadingToast({
		forbidClick: true,
		duration: 0,
	})
}
