export const errorToastOptions = {
	duration: 0,
	overlay: true,
	closeOnClickOverlay: true,
	className: 'w-[80vw]',
}

export function showLoading() {
	showLoadingToast({
		message: 'Loading...',
		forbidClick: true,
	})
}
