import PerfectScrollbar from 'perfect-scrollbar';
import useTemplate from '../template/template'

class SelectionInit {
    constructor(selector, options) {
        const parent = selector;
        var options = options || {}
        var self = this
        this.parent = parent
        this.isMobile = window.innerWidth <= 991
        this.closeBtn = parent.querySelector('.js-selection-results-close-btn')
        this.dataContainer = parent.querySelector('.js-selection-results-data')
        this.resultsShown = false





        this.data = [] // array of objects
        if (this.dataContainer) {
            S.each(JSON.parse(this.dataContainer.dataset.arr), function () {
                self.data.push(this['value'])
            })


        }




        this.modal = S.closest(this.parent, '.modal')

        this.resultsSelectedElms = []
        this.inputs = []


        this.resultsElmHeight = 0
        this.resultsElmPos = 0
        this.resultItems = []
        this.resultInputs = []
        this.isBottom = false
        this.clearBtn = parent.querySelector('.js-selection-clear-selected')
        this.multiple = false
        // this.templateSelector = '#template-selection-result'

        this.inputLim = 25
        this.resultsLength = 0

        if (!parent) return

        const preloaderElm = parent.querySelector('.preloader')

        // Defaults
        Object.assign(this, {
            input: parent.querySelector('.js-selection-main-input'),
            searchInput: parent.querySelector('.js-selection-search-input'),
            resultsElm: parent.querySelector('.js-selection-results'),
            noResultsElm: parent.querySelector('.js-selection-no-results'),
            resultsListElm: parent.querySelector('.js-selection-results-list'),
            templateSelector: '#template-selection-result',
            preloaderElm: preloaderElm,
            minChars: 3,
            activeIndex: 0,
            debounce: null,
            search: true,
            ajax: false,
            staticData: false,
            bottomFactor: null,
            // ajax: {
            //     debounce: null,
            //     onInput: null
            // },
            onInput: function () {},
            onSelected: function () {},
            onClearedSelected: function () {}
        }, options)

        Object.assign(this, this.ajax, options.ajax)

        this.template = document.querySelector(this.templateSelector)

        // Bind events
        if (this.ajax) {
            this.input.addEventListener('input', this.togglePreloaderAndResults.bind(this))

            if (this.searchInput) {
                this.searchInput.addEventListener('input', this.getData.bind(this, this.ajax.debounce))
            }
        } else {

            this.render(this.dataContainer)
            if (this.searchInput) {

                this.searchInput.addEventListener('input', this.searching.bind(this))
            }
        }



        this.input.addEventListener('focus', this.showResultsElm.bind(this))

        this.closeBtn.addEventListener('click', this.hideResultsElm.bind(this))


        if (this.modal) {
            this.modal.addEventListener('scroll', this.hideResultsElm.bind(this))
        }

        this.clearBtn.addEventListener('click', this.clearSelected.bind(this))


        if (window.innerWidth > 991) {
            window.addEventListener('scroll', this.hideResultsElm.bind(this))
            document.addEventListener('click', function (e) {
                var clickedOnThisSelection = e.target.closest('.js-selection') == self.parent

                if (!clickedOnThisSelection) {
                    self.hideResultsElm()
                }

            })

        } else {
            window.addEventListener('resize', this.setPosition.bind(this))
        }


        // Custom events
        this.event = new CustomEvent('selected');
        this.resultOpenedEvent = new CustomEvent('resultOpened')
        this.resultClosedEvent = new CustomEvent('resultClosed')

        if (!this.isMobile) {

            // change to this.sb
            // this.ps = new PerfectScrollbar(this.resultsListElm, {
            //     maxScrollbarLength: 50,
            //     wheelSpeed: .5,
            //     swipeEasing: true,
            //     wheelPropagation: false
            // })
        }

        this.setPosition()




    }


    getData(deb) {

        // Debounce 
        if (deb) {
            this.showPreloader()
            this.resultsElm.classList.add('disabled')

            clearTimeout(deb.timeout)
            deb.timeout = setTimeout(() => {


                // Call external function and send current this state
                this.ajax.onInput.apply(this)

                this.hidePreloader()
                this.resultsElm.classList.remove('disabled')
                this.showResultsElm()
            }, deb.delay);
        }

    }

    searching() {
        self = this

        let val = this.searchInput.value.toLowerCase()


        let filteredData

        filteredData = this.data.filter(item => {
            return item.toLowerCase().indexOf(val) != -1
        })

        S.each(this.resultItems, function () {
            this.hidden = true
        })

        S.each(filteredData, function () {
            var searchResultElms = S.find(self.resultsElm, `[data-value="${this}"]`)
            S.each(searchResultElms, function () {
                this.hidden = false
            })

        });

        if (!this.isMobile) {
            this.ps.update()
        }

    }

    render(data) {
        self = this

        if (this.ajax) {
            // clear results because with every click data appended not updated
            this.resultItems = S.find(this.resultsListElm, '.selection__result')

            if (this.resultItems.length > 0) {
                S.each(this.resultItems, function () {
                    S.remove(this)
                })
            }
        }


        if (!this.staticData) {
            useTemplate(this.template, data, this.resultsListElm)
        }




        this.resultItems = S.find(this.resultsListElm, '.selection__result')
        this.inputs = S.find(this.resultsListElm, 'input')



        S.each(this.inputs, function () {
            this.addEventListener('change', self.selectResults.bind(self))
        })

        this.hidePreloader()
    }
    selectResults(e) {

        var results = []
        var lim = this.inputLim
        var length = 0
        var symbolsNumber = 0
        var resultsFirstArr = []
        var resultsSecArr = []
        S.removeClass(this.resultItems, 'active')

        this.resultsSelectedElms = this.resultItems.filter(elm => {
            return S.first(elm, 'input:checked')
        })



        this.resultInputs = this.inputs.filter(input => {
            return input.checked
        })


        S.each(this.resultsSelectedElms, function () {
            S.addClass(this, 'active')
            results.push(S.attr(this, 'data-value'));
        });


        if (results.length == 0) {
            this.clearSelected()

            return
        }

        if (results.join('').length >= lim) {
            let tempArr = []

            results.forEach((element, i) => {
                if (i < this.resultsLength) {
                    symbolsNumber += element.length
                    resultsFirstArr.push(element)
                    tempArr.push(element)
                }
            });

            var sliceIndex = lim - symbolsNumber - 5 > 0 ? lim - symbolsNumber - 5 : 0

            if (results[this.resultsLength].length > sliceIndex) {
                var str = results[this.resultsLength].slice(0, sliceIndex)

                if (str.length > 0) {
                    resultsFirstArr.push(str + '...')
                    tempArr.push(results[this.resultsLength])
                }
            }


            resultsSecArr = results.filter(item => {
                return tempArr.indexOf(item) == -1
            })

            let num = resultsSecArr.length

            length = resultsSecArr.length == 0 ? '' : ' + ' + num
            this.input.value = resultsFirstArr.join(', ') + length

        } else {
            S.each(results, function () {

                resultsFirstArr.push(this)
            })
            this.resultsLength = resultsFirstArr.length
            this.input.value = resultsFirstArr.join(', ')
        }


        this.onSelected()


        if (!this.multiple) {
            this.hideResultsElm()
        }


    }

    clearSelected() {
        if (this.input.value = '') return

        S.each(this.resultInputs, function () {
            this.checked = false
        })
        S.each(this.resultsSelectedElms, function () {
            S.removeClass(this, 'active')

        });

        this.resultsSelectedElms = []
        this.input.value = ''


        this.onClearedSelected()
    }


    showPreloader() {
        if (this.input.value.length < this.minChars) return
        this.preloaderElm.classList.add('show')
    }

    hidePreloader() {
        this.preloaderElm.classList.remove('show')
    }

    showResultsElm() {


        if (this.input.value.length < this.minChars && this.ajax == true) return

        if (window.innerWidth < 991) {

            var selectionOpened = new CustomEvent('selectionOpened')
            document.dispatchEvent(selectionOpened)
        }

        this.setPosition()

        this.resultsElm.classList.add('show')
        this.parent.classList.add('show')
        this.resultsShown = true
    }

    hideResultsElm() {
        if (!this.resultsShown) return

        this.input.blur()


        this.resultsElm.classList.remove('show')
        if (this.searchInput) {
            this.searchInput.value = ''
            this.searchInput.blur()
            if (!this.ajax) {

                // after hiding animation ends
                setTimeout(() => {
                    S.trigger(this.searchInput, 'input');

                }, 300);
            }
        }


        this.parent.classList.remove('show')



        if (window.innerWidth < 991) {

            var selectionClosed = new CustomEvent('selectionClosed')
            document.dispatchEvent(selectionClosed)
        }
        this.resultsShown = false

    }

    togglePreloaderAndResults() {
        if (this.input.value.length < 3) {
            this.hidePreloader()
            this.hideResultsElm()
        } else {
            this.showPreloader()
        }
    }

    on(method, fn, options) {
        this.input.addEventListener(method, fn.bind(this), options)
    }

    setPosition() {

        this.searchitBottomPos = this.parent.getBoundingClientRect().y + this.parent.getBoundingClientRect().height
        this.resultsElmHeight = this.resultsElm.scrollHeight
        if (this.bottomFactor) {
            if (window.innerWidth > 991) {
                this.isBottom = this.noResultsElm ? window.innerHeight - this.searchitBottomPos < this.noResultsElm.scrollHeight : window.innerHeight - this.searchitBottomPos < this.resultsElmHeight
            } else {
                this.isBottom = this.noResultsElm ? window.innerHeight - this.bottomFactor - this.searchitBottomPos < this.noResultsElm.scrollHeight : window.innerHeight - this.bottomFactor - this.searchitBottomPos < this.resultsElmHeight
            }
        } else {
            this.isBottom = this.noResultsElm ? window.innerHeight - this.bottomFactor - this.searchitBottomPos < this.noResultsElm.scrollHeight : window.innerHeight - this.bottomFactor - this.searchitBottomPos < this.resultsElmHeight
        }

        if (this.isBottom) {
            S.addClass(this.parent, 'selection--bottom')
        } else {
            S.removeClass(this.parent, 'selection--bottom')
        }

        // if (window.innerWidth > 991) {
        //     this.resultsElmPos = this.parent.getBoundingClientRect().height

        //     if (this.isBottom) {
        //         this.resultsElm.style = `top: auto; bottom: ${this.resultsElmPos}px`
        //         if (!this.noResultsElm) return
        //         this.noResultsElm.style = `top: auto; bottom: ${this.resultsElmPos}px`

        //     } else {
        //         this.resultsElm.style = `bottom: auto; top: ${this.resultsElmPos}px`
        //         if (!this.noResultsElm) return
        //         this.noResultsElm.style = `bottom: auto; top: ${this.resultsElmPos}px`
        //     }

        // } else {
        //     this.resultsElmPos = this.parent.getBoundingClientRect().y * -1

        //     // setTimeout(() => {
        //     // }, 300);
        //     this.resultsElm.style = `height: ${window.innerHeight}px; top: ${this.resultsElmPos}px`
        //     if (!this.noResultsElm) return
        //     this.noResultsElm.style = `height: ${(window.innerHeight - 60)}px; top: ${(this.resultsElmPos + 60)}px`
        // }

        this.resultsElmPos = this.parent.getBoundingClientRect().height

        if (this.isBottom) {
            this.resultsElm.style = `top: auto; bottom: ${this.resultsElmPos}px`
            if (!this.noResultsElm) return
            this.noResultsElm.style = `top: auto; bottom: ${this.resultsElmPos}px`

        } else {
            this.resultsElm.style = `bottom: auto; top: ${this.resultsElmPos}px`
            if (!this.noResultsElm) return
            this.noResultsElm.style = `bottom: auto; top: ${this.resultsElmPos}px`
        }

    }
}


function Selection(selector, options) {
    var obj = {}
    let elms = []

    if (typeof selector === 'string') {
        elms = [].slice.call(document.querySelectorAll(selector))
    } else if (selector instanceof SS) {
        elms.push(selector[0])
    }

    elms.forEach((elm, i) => {
        obj[i] = new SelectionInit(elm, options)
    })

    if (elms.length === 1) {
        return obj[0]
    }

    return obj
}




export default Selection

initSelection()


function initSelection() {
    var simpleSelection = new Selection('.js-selection-single:not(.js-selection-ajax):not(.js-selection--special):not(.js-selection--calendar)', {
        templateSelector: '#template-selection-result'
    })

    var multipleSelection = new Selection('.js-selection-multiple:not(.js-selection-ajax):not(.js-selection--special):not(.js-selection--calendar)', {
        multiple: true,
        templateSelector: '#template-selection-result-multiple'
    })


}

// for ajax uncomment and put the code below in backend.js
// var s1 = App.Selection('.selection--ajax', {
//     minChars: 3,
//     preloader: true,
//     ajax: {
//         debounce: {
//             delay: 500
//         },
//         onInput: function () {
//             var self = this;

//             axios.get('../../design/user/assets/data/data.json', {
//                     body: self.searchInput.value
//                 })
//                 .then(function (response) {
//                     self.render(response.data)
//                     self.setPosition()
//                 })
//         }
//     },
//     templateSelector: '#template-selection-result'
// })

window.App.Selection = Selection

S.makeGlobal('initSelection', initSelection)