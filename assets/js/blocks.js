(function (blocks, blockEditor, element, components, i18n, data) {
    'use strict';

    var registerBlockType = blocks.registerBlockType;
    var createBlock = blocks.createBlock;
    var __ = i18n.__;
    var createElement = element.createElement;
    var Fragment = element.Fragment;

    var InspectorControls = blockEditor.InspectorControls;
    var InnerBlocks = blockEditor.InnerBlocks;
    var useBlockProps = blockEditor.useBlockProps;
    var useInnerBlocksProps = blockEditor.useInnerBlocksProps;
    var BlockControls = blockEditor.BlockControls;

    var PanelBody = components.PanelBody;
    var ToggleControl = components.ToggleControl;
    var RangeControl = components.RangeControl;
    var ToolbarGroup = components.ToolbarGroup;
    var ToolbarButton = components.ToolbarButton;
    var Button = components.Button;
    var Notice = components.Notice;

    var useSelect = data.useSelect;
    var useDispatch = data.useDispatch;

    var ALLOWED_CONTENT_BLOCKS = [
        'core/paragraph',
        'core/heading',
        'core/list',
        'core/image',
        'core/gallery',
        'core/media-text',
        'core/columns',
        'core/group',
        'core/buttons',
        'core/quote',
        'core/embed',
        'core/video',
        'core/table'
    ];

    var SLIDE_TEMPLATE = [
        ['core/heading', { level: 2, placeholder: __('Slide title', 'pitch-deck') }],
        ['core/paragraph', { placeholder: __('Add supporting copy…', 'pitch-deck') }]
    ];

    registerBlockType('pitch-deck/deck', {
        title: __('Pitch Deck', 'pitch-deck'),
        icon: 'slides',
        category: 'design',
        description: __('Group slide blocks and configure navigation, autoplay, and progress UI.', 'pitch-deck'),
        supports: {
            align: ['wide', 'full'],
            spacing: {
                padding: true,
                margin: true,
                blockGap: true
            }
        },
        attributes: {
            showControls: {
                type: 'boolean',
                default: true
            },
            showProgress: {
                type: 'boolean',
                default: true
            },
            showCounter: {
                type: 'boolean',
                default: true
            },
            autoplay: {
                type: 'boolean',
                default: false
            },
            autoplayDelay: {
                type: 'number',
                default: 6
            },
            loop: {
                type: 'boolean',
                default: false
            }
        },
        edit: function (props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var clientId = props.clientId;

            var blockProps = useBlockProps({
                className: 'pitch-deck-deck'
            });

            var dispatch = useDispatch('core/block-editor');
            var insertBlock = dispatch.insertBlock;
            var removeBlock = dispatch.removeBlock;

            var slideOrder = useSelect(function (select) {
                return select('core/block-editor').getBlockOrder(clientId) || [];
            }, [clientId]);

            var slideCount = slideOrder.length;

            var addSlide = function () {
                var slide = createBlock('pitch-deck/slide');
                insertBlock(slide, undefined, clientId);
            };

            var removeLastSlide = function () {
                if (!slideOrder.length) {
                    return;
                }
                var lastId = slideOrder[slideOrder.length - 1];
                removeBlock(lastId, false);
            };

            var innerBlocksProps = useInnerBlocksProps(
                {
                    className: 'pitch-deck-slides'
                },
                {
                    allowedBlocks: ['pitch-deck/slide'],
                    template: [['pitch-deck/slide']],
                    renderAppender: false
                }
            );

            var controlsToolbar = createElement(
                BlockControls,
                null,
                createElement(
                    ToolbarGroup,
                    null,
                    createElement(
                        ToolbarButton,
                        {
                            icon: 'plus',
                            label: __('Add slide', 'pitch-deck'),
                            onClick: addSlide
                        }
                    ),
                    createElement(
                        ToolbarButton,
                        {
                            icon: 'minus',
                            label: __('Remove last slide', 'pitch-deck'),
                            onClick: removeLastSlide,
                            disabled: slideCount <= 1
                        }
                    )
                )
            );

            var inspectorControls = createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: __('Deck UI', 'pitch-deck'), initialOpen: true },
                    createElement(ToggleControl, {
                        label: __('Show navigation buttons', 'pitch-deck'),
                        checked: attributes.showControls,
                        onChange: function (value) {
                            setAttributes({ showControls: value });
                        }
                    }),
                    createElement(ToggleControl, {
                        label: __('Show progress bar', 'pitch-deck'),
                        checked: attributes.showProgress,
                        onChange: function (value) {
                            setAttributes({ showProgress: value });
                        }
                    }),
                    createElement(ToggleControl, {
                        label: __('Show slide counter', 'pitch-deck'),
                        checked: attributes.showCounter,
                        onChange: function (value) {
                            setAttributes({ showCounter: value });
                        }
                    })
                ),
                createElement(
                    PanelBody,
                    { title: __('Autoplay', 'pitch-deck'), initialOpen: false },
                    createElement(ToggleControl, {
                        label: __('Enable autoplay', 'pitch-deck'),
                        checked: attributes.autoplay,
                        onChange: function (value) {
                            setAttributes({ autoplay: value });
                        }
                    }),
                    createElement(RangeControl, {
                        label: __('Delay between slides (seconds)', 'pitch-deck'),
                        value: attributes.autoplayDelay,
                        onChange: function (value) {
                            setAttributes({ autoplayDelay: value || 6 });
                        },
                        min: 3,
                        max: 30,
                        step: 1,
                        disabled: !attributes.autoplay
                    }),
                    createElement(ToggleControl, {
                        label: __('Loop when reaching the end', 'pitch-deck'),
                        checked: attributes.loop,
                        onChange: function (value) {
                            setAttributes({ loop: value });
                        },
                        disabled: !attributes.autoplay
                    })
                )
            );

            var slideHelper = slideCount > 1
                ? createElement(
                    Notice,
                    { status: 'info', isDismissible: false },
                    __('Use the toolbar or button below to add or remove slides.', 'pitch-deck')
                )
                : createElement(
                    Notice,
                    { status: 'info', isDismissible: false },
                    __('A deck starts with one slide. Add more using the button below.', 'pitch-deck')
                );

            return createElement(
                Fragment,
                null,
                controlsToolbar,
                inspectorControls,
                createElement(
                    'div',
                    blockProps,
                    createElement(
                        'div',
                        { className: 'pitch-deck-editor-toolbar' },
                        slideHelper,
                        createElement(
                            Button,
                            {
                                icon: 'plus',
                                variant: 'primary',
                                onClick: addSlide
                            },
                            __('Add slide', 'pitch-deck')
                        )
                    ),
                    createElement('div', innerBlocksProps)
                )
            );
        },
        save: function (props) {
            var attributes = props.attributes;
            var autoplayDelay = attributes.autoplayDelay || 6;

            var blockProps = blockEditor.useBlockProps.save({
                className: 'pitch-deck-deck',
                'data-autoplay': attributes.autoplay ? 'true' : 'false',
                'data-autoplay-delay': String(autoplayDelay * 1000),
                'data-loop': attributes.loop ? 'true' : 'false',
                'data-show-controls': attributes.showControls ? 'true' : 'false',
                'data-show-progress': attributes.showProgress ? 'true' : 'false',
                'data-show-counter': attributes.showCounter ? 'true' : 'false'
            });

            var children = [
                createElement(
                    'div',
                    { className: 'pitch-deck-slides' },
                    createElement(InnerBlocks.Content, null)
                )
            ];

            if (attributes.showControls) {
                children.push(
                    createElement(
                        'div',
                        { className: 'pitch-deck-controls' },
                        createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'pitch-deck-button pitch-deck-button--prev',
                                'aria-label': __('Previous slide', 'pitch-deck')
                            },
                            createElement('span', { 'aria-hidden': 'true' }, '‹')
                        ),
                        attributes.autoplay
                            ? createElement(
                                'button',
                                {
                                    type: 'button',
                                    className: 'pitch-deck-button pitch-deck-button--play',
                                    'aria-label': __('Toggle autoplay', 'pitch-deck')
                                },
                                createElement('span', { className: 'pitch-deck-button__icon', 'aria-hidden': 'true' }, '▌▌')
                            )
                            : null,
                        createElement(
                            'button',
                            {
                                type: 'button',
                                className: 'pitch-deck-button pitch-deck-button--next',
                                'aria-label': __('Next slide', 'pitch-deck')
                            },
                            createElement('span', { 'aria-hidden': 'true' }, '›')
                        ),
                    )
                );
            }

            if (attributes.showProgress) {
                children.push(
                    createElement(
                        'div',
                        { className: 'pitch-deck-progress' },
                        createElement(
                            'div',
                            { className: 'pitch-deck-progress__track' },
                            createElement('div', { className: 'pitch-deck-progress__bar' })
                        )
                    )
                );
            }

            if (attributes.showCounter) {
                children.push(
                    createElement(
                        'div',
                        { className: 'pitch-deck-counter', 'aria-live': 'polite' },
                        createElement('span', { className: 'pitch-deck-counter__current' }, '1'),
                        createElement('span', { className: 'pitch-deck-counter__separator' }, '/'),
                        createElement('span', { className: 'pitch-deck-counter__total' }, '1')
                    )
                );
            }

            return createElement('div', blockProps, children);
        }
    });

    registerBlockType('pitch-deck/slide', {
        title: __('Pitch Deck Slide', 'pitch-deck'),
        icon: 'index-card',
        category: 'design',
        parent: ['pitch-deck/deck'],
        description: __('Compose an individual pitch deck slide using any blocks.', 'pitch-deck'),
        supports: {
            reusable: false,
            color: {
                background: true,
                text: true
            },
            spacing: {
                padding: true,
                margin: ['top', 'bottom']
            }
        },
        edit: function () {
            var blockProps = useBlockProps({
                className: 'pitch-deck-slide'
            });

            var innerProps = useInnerBlocksProps(blockProps, {
                allowedBlocks: ALLOWED_CONTENT_BLOCKS,
                template: SLIDE_TEMPLATE,
                templateLock: false
            });

            return createElement('div', innerProps);
        },
        save: function () {
            var blockProps = blockEditor.useBlockProps.save({
                className: 'pitch-deck-slide'
            });

            var innerProps = blockEditor.useInnerBlocksProps.save(blockProps);

            return createElement('div', innerProps);
        }
    });

})(window.wp.blocks, window.wp.blockEditor, window.wp.element, window.wp.components, window.wp.i18n, window.wp.data);
