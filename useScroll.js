import { useEffect, useState } from 'react'


const TargetElement = HTMLElement | Element | Document | Window


export function getTargetElement(target, defaultElement = TargetElement) {

	if (!target) {

		return defaultElement

	}


	let targetElement = TargetElement | undefined | null


	if (typeof target === 'function') {

		targetElement = target()

	} else if ('current' in target) {

		targetElement = target.current

	} else {

		targetElement = target

	}


	return targetElement

}


function useScroll(target, shouldUpdate = (val) => !!val) {

	const [position, setPosition] = useState({

		left: NaN,

		top: NaN,

	})


	useEffect(() => {

		const el = getTargetElement(target, document)

		if (!el) return


		function updatePosition(currentTarget) {

			let newPosition

			if (currentTarget === document) {

				if (document.scrollingElement) {

					newPosition = {

						left: document.scrollingElement.scrollLeft,

						top: document.scrollingElement.scrollTop,

					}

				} else if (document.body) {

					newPosition = {

						left: document.body.scrollLeft,

						top: document.body.scrollTop,

					}

				}

			} else {

				newPosition = {

					left: currentTarget.scrollLeft,

					top: currentTarget.scrollTop,

				}

			}

			if (shouldUpdate(newPosition)) setPosition(newPosition)

		}


		updatePosition(el)


		function listener(event) {

			if (!event.target) return

			updatePosition(event.target)

		}


		el.addEventListener('scroll', listener, false)

		return () => {

			el.removeEventListener('scroll', listener, false)

		}

	}, [target])


	return position

}


export default useScroll
