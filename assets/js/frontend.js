/**
 * Pitch Deck front-end interactions.
 */
(function () {
    'use strict';

    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_SPACE = 32;
    var KEY_ESCAPE = 27;

    function PitchDeck(node) {
        this.root = node;
        this.slidesWrapper = node.querySelector('.pitch-deck-slides');
        this.slides = this.slidesWrapper ? Array.prototype.slice.call(this.slidesWrapper.querySelectorAll('.pitch-deck-slide')) : [];
        this.index = 0;
        this.timer = null;
        this.touchStart = null;

        this.autoplayEnabled = node.dataset.autoplay === 'true';
        this.autoplayDelay = parseInt(node.dataset.autoplayDelay, 10) || 6000;
        this.loop = node.dataset.loop === 'true';

        this.btnPrev = node.querySelector('.pitch-deck-button--prev');
        this.btnNext = node.querySelector('.pitch-deck-button--next');
        this.btnPlay = node.querySelector('.pitch-deck-button--play');
        this.progressBar = node.querySelector('.pitch-deck-progress__bar');
        this.counterCurrent = node.querySelector('.pitch-deck-counter__current');
        this.counterTotal = node.querySelector('.pitch-deck-counter__total');

        this.isPlaying = false;

        this.init();
    }

    PitchDeck.prototype.init = function () {
        if (!this.slides.length) {
            this.root.classList.add('pitch-deck-deck--empty');
            return;
        }

        this.slides.forEach(function (slide, position) {
            if (position === 0) {
                slide.classList.add('is-active');
            } else {
                slide.classList.remove('is-active');
            }
        });

        if (this.counterTotal) {
            this.counterTotal.textContent = String(this.slides.length);
        }

        this.bindEvents();
        this.updateUI();

        if (this.autoplayEnabled) {
            this.startAutoplay();
        }
    };

    PitchDeck.prototype.bindEvents = function () {
        var self = this;

        if (this.btnPrev) {
            this.btnPrev.addEventListener('click', function () {
                self.prev();
                self.pauseAutoplay();
            });
        }

        if (this.btnNext) {
            this.btnNext.addEventListener('click', function () {
                self.next();
                self.pauseAutoplay();
            });
        }

        if (this.btnPlay) {
            this.btnPlay.addEventListener('click', function () {
                if (self.isPlaying) {
                    self.pauseAutoplay(true);
                } else {
                    self.startAutoplay(true);
                }
            });
        }

        this.root.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case KEY_LEFT:
                    event.preventDefault();
                    self.prev();
                    self.pauseAutoplay();
                    break;
                case KEY_RIGHT:
                case KEY_SPACE:
                    event.preventDefault();
                    self.next();
                    self.pauseAutoplay();
                    break;
                default:
                    break;
            }
        });

        this.root.addEventListener('touchstart', function (event) {
            if (!event.touches || !event.touches.length) {
                return;
            }
            self.touchStart = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
        });

        this.root.addEventListener('touchend', function (event) {
            if (!self.touchStart || !event.changedTouches || !event.changedTouches.length) {
                return;
            }

            var endX = event.changedTouches[0].clientX;
            var endY = event.changedTouches[0].clientY;
            var diffX = self.touchStart.x - endX;
            var diffY = self.touchStart.y - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    self.next();
                } else {
                    self.prev();
                }
                self.pauseAutoplay();
            }

            self.touchStart = null;
        });

    };

    PitchDeck.prototype.next = function () {
        var nextIndex = this.index + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = this.loop ? 0 : this.slides.length - 1;
        }
        this.goTo(nextIndex);
    };

    PitchDeck.prototype.prev = function () {
        var previousIndex = this.index - 1;
        if (previousIndex < 0) {
            previousIndex = this.loop ? this.slides.length - 1 : 0;
        }
        this.goTo(previousIndex);
    };

    PitchDeck.prototype.goTo = function (index) {
        if (!this.slides.length || index === this.index) {
            return;
        }

        if (index < 0) {
            index = 0;
        } else if (index >= this.slides.length) {
            index = this.slides.length - 1;
        }

        this.slides[this.index].classList.remove('is-active');
        this.index = index;
        this.slides[this.index].classList.add('is-active');

        this.updateUI();
    };

    PitchDeck.prototype.updateUI = function () {
        if (this.counterCurrent) {
            this.counterCurrent.textContent = String(this.index + 1);
        }

        if (this.progressBar) {
            var progress = ((this.index + 1) / this.slides.length) * 100;
            this.progressBar.style.width = progress + '%';
        }

        if (this.btnPrev) {
            this.btnPrev.disabled = !this.loop && this.index === 0;
        }
        if (this.btnNext) {
            this.btnNext.disabled = !this.loop && this.index === this.slides.length - 1;
        }
    };

    PitchDeck.prototype.startAutoplay = function (userInitiated) {
        var self = this;

        if (!this.autoplayEnabled && !userInitiated) {
            return;
        }

        if (userInitiated) {
            this.autoplayEnabled = true;
        }

        if (this.timer) {
            clearInterval(this.timer);
        }

        this.isPlaying = true;
        this.updatePlayButton();

        this.timer = setInterval(function () {
            var nextIndex = self.index + 1;
            if (nextIndex >= self.slides.length) {
                if (self.loop) {
                    nextIndex = 0;
                } else {
                    self.pauseAutoplay();
                    return;
                }
            }
            self.goTo(nextIndex);
        }, this.autoplayDelay);
    };

    PitchDeck.prototype.pauseAutoplay = function (userInitiated) {
        if (!this.isPlaying && !userInitiated) {
            return;
        }

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (userInitiated) {
            this.autoplayEnabled = false;
        }

        this.isPlaying = false;
        this.updatePlayButton();
    };

    PitchDeck.prototype.updatePlayButton = function () {
        if (!this.btnPlay) {
            return;
        }

        var icon = this.btnPlay.querySelector('.pitch-deck-button__icon');
        if (!icon) {
            icon = this.btnPlay;
        }

        if (this.isPlaying) {
            icon.textContent = '▌▌';
            this.btnPlay.setAttribute('aria-pressed', 'true');
        } else {
            icon.textContent = '►';
            this.btnPlay.setAttribute('aria-pressed', 'false');
        }
    };

    function init() {
        var decks = document.querySelectorAll('.pitch-deck-deck');
        Array.prototype.forEach.call(decks, function (deck) {
            if (!deck.__pitchDeckInstance) {
                deck.setAttribute('tabindex', '0');
                deck.__pitchDeckInstance = new PitchDeck(deck);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
