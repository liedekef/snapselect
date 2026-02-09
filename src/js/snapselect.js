(function() {
  /**
   * SnapSelect - A custom select box plugin with various customization options.
   *
   * @param {HTMLElement} element - The select element to be enhanced.
   * @param {Object} options - An object containing configuration options.
   * 
   * Options:
   * - liveSearch (boolean): Enables search functionality within the dropdown.
   * - maxSelections (number): Limits the number of selections (for multiple select).
   * - placeholder (string): Placeholder text for the select box.
   * - clearAllButton (boolean): Shows a button to clear all selections (for multiple select).
   * - selectOptgroups (boolean): Allows selecting all options within an optgroup.
   * - selectAllOption (boolean): Adds a "Select All" option to the dropdown (for multiple select).
   * - closeOnSelect (boolean): Closes the dropdown after selecting an option (single-select only).
   * - allowEmpty (boolean): Allows deselection of a selected option (for single select).
   */
    function SnapSelect(element, options = {}) {
        const select = element;
        const isMultiple = select.multiple;
        
        // Read options from data attributes
        const dataOptions = {
            liveSearch: select.hasAttribute('data-live-search') ? select.getAttribute('data-live-search') === 'true' : undefined,
            maxSelections: select.hasAttribute('data-max-selections') ? parseInt(select.getAttribute('data-max-selections')) : undefined,
            placeholder: select.hasAttribute('data-placeholder') ? select.getAttribute('data-placeholder') : undefined,
            clearAllButton: select.hasAttribute('data-clear-all-button') ? select.getAttribute('data-clear-all-button') === 'true' : undefined,
            selectOptgroups: select.hasAttribute('data-select-optgroups') ? select.getAttribute('data-select-optgroups') === 'true' : undefined,
            selectAllOption: select.hasAttribute('data-select-all-option') ? select.getAttribute('data-select-all-option') === 'true' : undefined,
            closeOnSelect: select.hasAttribute('data-close-on-select') ? select.getAttribute('data-close-on-select') === 'true' : undefined,
            allowEmpty: select.hasAttribute('data-allow-empty') ? select.getAttribute('data-allow-empty') === 'true' : undefined
        };
        
        // Combine default options, plugin default options, and user options
        const config = {
            liveSearch: dataOptions.liveSearch !== undefined ? dataOptions.liveSearch : (options.liveSearch !== undefined ? options.liveSearch : false),
            maxSelections: dataOptions.maxSelections !== undefined ? dataOptions.maxSelections : (options.maxSelections !== undefined ? options.maxSelections : Infinity),
            placeholder: dataOptions.placeholder !== undefined ? dataOptions.placeholder : (options.placeholder !== undefined ? options.placeholder : 'Select...'),
            clearAllButton: dataOptions.clearAllButton !== undefined ? dataOptions.clearAllButton : (options.clearAllButton !== undefined ? options.clearAllButton : false),
            selectOptgroups: dataOptions.selectOptgroups !== undefined ? dataOptions.selectOptgroups : (options.selectOptgroups !== undefined ? options.selectOptgroups : false),
            selectAllOption: dataOptions.selectAllOption !== undefined ? dataOptions.selectAllOption : (options.selectAllOption !== undefined ? options.selectAllOption : false),
            closeOnSelect: dataOptions.closeOnSelect !== undefined ? dataOptions.closeOnSelect : (options.closeOnSelect !== undefined ? options.closeOnSelect : true),
            allowEmpty: dataOptions.allowEmpty !== undefined ? dataOptions.allowEmpty : (options.allowEmpty !== undefined ? options.allowEmpty : false)
        };

        // Store references for public methods
        this.selectElement = select;
        this.config = config;
        this.isMultiple = isMultiple;

        // Apply ARIA roles and attributes
        const customSelect = document.createElement('div');
        customSelect.classList.add('snap-select');
        customSelect.setAttribute('role', 'combobox');
        customSelect.setAttribute('aria-expanded', 'false');
        customSelect.setAttribute('aria-haspopup', 'listbox');
        select.parentNode.insertBefore(customSelect, select);
        customSelect.appendChild(select);
        
        const selectedContainer = document.createElement('div');
        selectedContainer.classList.add('snap-select-selected');
        selectedContainer.setAttribute('aria-live', 'polite');
        selectedContainer.setAttribute('tabindex', '0'); // Make focusable
        customSelect.appendChild(selectedContainer);
        
        const tagContainer = document.createElement('div');
        tagContainer.classList.add('snap-select-tags');
        selectedContainer.appendChild(tagContainer);

        // Dropdown and overlay will be created on demand and appended to body
        let itemsContainer = null;
        let dropdownOverlay = null;
        let searchInput = null;
        let clearSearchButton = null;

        // Store selected values and checkbox references
        const selectedValues = new Set();
        const checkboxMap = new Map(); // Map of value -> checkbox element

        // Function to update display and select element
        const updateDisplay = () => {
            tagContainer.innerHTML = '';

            // Update actual select element
            Array.from(select.options).forEach(opt => {
                opt.selected = selectedValues.has(opt.value);
            });

            // Trigger change event
            select.dispatchEvent(new Event('change', { bubbles: true }));

            if (selectedValues.size === 0) {
                const placeholder = document.createElement('div');
                placeholder.classList.add('snap-select-placeholder');
                placeholder.textContent = config.placeholder;
                tagContainer.appendChild(placeholder);
            } else {
                const selectedArray = Array.from(selectedValues);

                selectedArray.forEach(val => {
                    const option = select.querySelector(`option[value="${val}"]`);
                    if (!option) return;

                    const tag = document.createElement('div');
                    tag.classList.add('snap-select-tag');
                    tag.textContent = option.textContent;

                    const removeButton = document.createElement('span');
                    removeButton.classList.add('snap-select-remove');
                    removeButton.textContent = '×';
                    removeButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectedValues.delete(val);
                        // Update the checkbox state
                        const checkbox = checkboxMap.get(val.toString());
                        if (checkbox) {
                            checkbox.checked = false;
                        }
                        updateDisplay();
                    });

                    tag.appendChild(removeButton);
                    tagContainer.appendChild(tag);
                });

                if (config.clearAllButton) {
                    const clearAllButton = document.createElement('span');
                    clearAllButton.classList.add('snap-select-clear-all');
                    clearAllButton.textContent = '×';
                    clearAllButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectedValues.clear();
                        checkboxMap.forEach(checkbox => checkbox.checked = false);
                        updateDisplay();
                    });
                    tagContainer.appendChild(clearAllButton);
                }
            }
        };

        // Function to close dropdown
        const closeDropdown = () => {
            selectedContainer.focus(); // Return focus to trigger
            if (itemsContainer) {
                itemsContainer.remove();
                itemsContainer = null;
            }
            if (dropdownOverlay) {
                dropdownOverlay.remove();
                dropdownOverlay = null;
            }
            if (customSelect._cleanupHandlers) {
                customSelect._cleanupHandlers();
                customSelect._cleanupHandlers = null;
            }
            customSelect.setAttribute('aria-expanded', 'false');
        };

        // Function to position dropdown
        const positionDropdown = () => {
            if (!itemsContainer) return;

            const rect = selectedContainer.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            let left = rect.left + scrollLeft;
            let top = rect.bottom + scrollTop + 4; // 4px gap

            itemsContainer.style.position = 'absolute';
            itemsContainer.style.left = `${left}px`;
            itemsContainer.style.top = `${top}px`;
            itemsContainer.style.width = `${rect.width}px`;
            itemsContainer.style.minWidth = `${rect.width}px`;
            itemsContainer.style.boxSizing = 'border-box';
            itemsContainer.style.zIndex = '10000';

            // Adjust horizontal position if needed
            const dropdownRect = itemsContainer.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            if (dropdownRect.right > viewportWidth) {
                left = Math.max(10, viewportWidth - dropdownRect.width - 10);
                itemsContainer.style.left = `${left}px`;
            }
        };

        function updateSingleSelect(text) {
            tagContainer.innerHTML = '';
            const selectedText = document.createElement('div');
            selectedText.classList.add('snap-select-single-selected-text');
            selectedText.textContent = text;

            if (config.allowEmpty) {
                const removeButton = document.createElement('span');
                removeButton.classList.add('snap-select-clear-all');
                removeButton.textContent = '×';
                removeButton.style.float = 'right';
                removeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = '';
                    updateSingleSelect(config.placeholder);
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                });
                selectedText.appendChild(removeButton);
                selectedText.style.display = 'inline-block';
                selectedText.style.width = 'calc(100% - 4px)';
            }

            tagContainer.appendChild(selectedText);
        }

        function updateVisibility() {
            if (!itemsContainer) return;
            
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

            // Filter optgroups
            Array.from(itemsContainer.querySelectorAll('.snap-select-optgroup')).forEach(group => {
                let hasVisibleOption = false;

                Array.from(group.querySelectorAll('.snap-select-item')).forEach(item => {
                    const keywords = item.dataset.key ? item.dataset.key.toLowerCase() : '';
                    const label = item.querySelector('.snap-select-label');
                    const text = label ? label.textContent.toLowerCase() : '';

                    if (text.includes(searchTerm) || keywords.includes(searchTerm)) {
                        item.style.display = '';
                        hasVisibleOption = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                const groupLabel = group.querySelector('.snap-select-optgroup-label');
                if (groupLabel && (groupLabel.textContent.toLowerCase().includes(searchTerm) || hasVisibleOption)) {
                    group.style.display = '';
                } else {
                    group.style.display = 'none';
                }
            });

            // Filter standalone options
            Array.from(itemsContainer.querySelectorAll('.snap-select-item')).forEach(item => {
                if (item.closest('.snap-select-optgroup')) return; // Skip grouped items
                
                const keywords = item.dataset.key ? item.dataset.key.toLowerCase() : '';
                const label = item.querySelector('.snap-select-label');
                const text = label ? label.textContent.toLowerCase() : '';

                if (text.includes(searchTerm) || keywords.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function populateItems() {
            if (!itemsContainer) return;
            
            itemsContainer.innerHTML = ''; // Clear previous items
            checkboxMap.clear(); // Clear checkbox references

            if (config.liveSearch) {
                const searchWrapper = document.createElement('div');
                searchWrapper.classList.add('snap-select-search-wrapper');
                itemsContainer.appendChild(searchWrapper);

                searchInput = document.createElement('input');
                searchInput.classList.add('snap-select-search');
                searchInput.setAttribute('placeholder', 'Search...');
                searchWrapper.appendChild(searchInput);

                clearSearchButton = document.createElement('span');
                clearSearchButton.classList.add('snap-select-clear-search');
                clearSearchButton.textContent = '×';
                clearSearchButton.style.display = 'none';
                clearSearchButton.addEventListener('click', () => {
                    searchInput.value = '';
                    clearSearchButton.style.display = 'none';
                    updateVisibility();
                });
                searchWrapper.appendChild(clearSearchButton);

                searchInput.addEventListener('input', () => {
                    clearSearchButton.style.display = searchInput.value ? 'inline' : 'none';
                    updateVisibility();
                });
            }

            if (isMultiple && config.selectAllOption) {
                const selectAllDiv = document.createElement('div');
                selectAllDiv.classList.add('snap-select-item', 'snap-select-all');
                
                const selectAllCheckbox = document.createElement('input');
                selectAllCheckbox.type = 'checkbox';
                selectAllCheckbox.classList.add('snap-select-checkbox');
                selectAllDiv.appendChild(selectAllCheckbox);
                
                const selectAllLabel = document.createElement('label');
                selectAllLabel.classList.add('snap-select-label');
                selectAllLabel.textContent = 'Select All';
                selectAllDiv.appendChild(selectAllLabel);
                
                selectAllDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let allSelected = selectedValues.size === select.options.length;
                    
                    if (allSelected) {
                        // Deselect all
                        selectedValues.clear();
                        checkboxMap.forEach(checkbox => checkbox.checked = false);
                        selectAllCheckbox.checked = false;
                    } else {
                        // Select all (up to max)
                        Array.from(select.options).forEach(option => {
                            if (selectedValues.size < config.maxSelections) {
                                selectedValues.add(option.value);
                                const checkbox = checkboxMap.get(option.value);
                                if (checkbox) checkbox.checked = true;
                            }
                        });
                        selectAllCheckbox.checked = true;
                    }
                    
                    updateDisplay();
                });
                
                itemsContainer.appendChild(selectAllDiv);
            }

            Array.from(select.children).forEach(child => {
                if (child.tagName === 'OPTGROUP') {
                    const group = document.createElement('div');
                    group.classList.add('snap-select-optgroup');
                    
                    const label = document.createElement('div');
                    label.classList.add('snap-select-optgroup-label');
                    label.textContent = child.label;
                    label.style.fontWeight = 'bold';

                    if (isMultiple && config.selectOptgroups) {
                        label.addEventListener('click', (e) => {
                            e.stopPropagation();
                            let addedCount = 0;
                            Array.from(child.children).forEach(option => {
                                if (selectedValues.size < config.maxSelections && !selectedValues.has(option.value)) {
                                    selectedValues.add(option.value);
                                    const checkbox = checkboxMap.get(option.value);
                                    if (checkbox) checkbox.checked = true;
                                    addedCount++;
                                }
                            });
                            if (addedCount > 0) {
                                updateDisplay();
                            }
                        });
                    }

                    group.appendChild(label);

                    Array.from(child.children).forEach(option => {
                        const item = createOptionItem(option);
                        group.appendChild(item);
                    });

                    itemsContainer.appendChild(group);
                } else if (child.tagName === 'OPTION') {
                    const item = createOptionItem(child);
                    item.dataset.optgroup = '';
                    itemsContainer.appendChild(item);
                }
            });
        }

        function createOptionItem(option) {
            const optionDiv = document.createElement('div');
            optionDiv.classList.add('snap-select-item');
            optionDiv.dataset.value = option.value;
            optionDiv.dataset.key = option.dataset.key || '';

            if (isMultiple) {
                // Create checkbox for multi-select
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('snap-select-checkbox');
                checkbox.checked = selectedValues.has(option.value);
                optionDiv.appendChild(checkbox);

                // Store checkbox reference
                checkboxMap.set(option.value, checkbox);

                const label = document.createElement('label');
                label.classList.add('snap-select-label');
                label.textContent = option.textContent;
                optionDiv.appendChild(label);

                // Click anywhere on the option to toggle
                optionDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (selectedValues.has(option.value)) {
                        selectedValues.delete(option.value);
                        checkbox.checked = false;
                    } else {
                        if (selectedValues.size < config.maxSelections) {
                            selectedValues.add(option.value);
                            checkbox.checked = true;
                        }
                    }
                    
                    updateDisplay();
                });
            } else {
                // Single select - no checkbox
                optionDiv.textContent = option.textContent;
                
                optionDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = option.value;
                    updateSingleSelect(option.textContent);
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    if (config.closeOnSelect) {
                        closeDropdown();
                    }
                });
            }

            return optionDiv;
        }

        // Toggle dropdown
        const toggleDropdown = (e) => {
            if (e) e.stopPropagation();

            if (itemsContainer) {
                // Dropdown is open, close it
                closeDropdown();
            } else {
                // Close any other open snapselect dropdowns
                document.querySelectorAll('.snap-select-items').forEach(dd => dd.remove());
                document.querySelectorAll('.snap-select-overlay').forEach(ov => ov.remove());

                // Create overlay
                dropdownOverlay = document.createElement('div');
                dropdownOverlay.classList.add('snap-select-overlay');
                document.body.appendChild(dropdownOverlay);

                // Create dropdown
                itemsContainer = document.createElement('div');
                itemsContainer.classList.add('snap-select-items');
                itemsContainer.setAttribute('role', 'listbox');
                if (isMultiple) {
                    itemsContainer.setAttribute('aria-multiselectable', 'true');
                }
                itemsContainer.setAttribute('tabindex', '-1');
                itemsContainer.style.display = 'block';
                document.body.appendChild(itemsContainer);

                // Populate options
                populateItems();

                // Position dropdown
                positionDropdown();

                // Focus dropdown
                itemsContainer.focus();

                // Update ARIA
                customSelect.setAttribute('aria-expanded', 'true');

                // Add keyboard navigation for multi-select
                if (isMultiple) {
                    itemsContainer.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            closeDropdown();
                        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                            e.preventDefault();
                            // Navigate between checkboxes
                            const checkboxes = Array.from(itemsContainer.querySelectorAll('.snap-select-checkbox'));
                            const current = document.activeElement;
                            const currentIndex = checkboxes.indexOf(current);

                            let nextIndex;
                            if (e.key === 'ArrowDown') {
                                nextIndex = currentIndex < checkboxes.length - 1 ? currentIndex + 1 : 0;
                            } else {
                                nextIndex = currentIndex > 0 ? currentIndex - 1 : checkboxes.length - 1;
                            }

                            checkboxes[nextIndex].focus();
                        } else if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            // Toggle the focused checkbox
                            if (document.activeElement.classList.contains('snap-select-checkbox')) {
                                document.activeElement.click();
                            }
                        }
                    });
                }

                // Handle clicks outside
                dropdownOverlay.addEventListener('click', (event) => {
                    if (event.target === dropdownOverlay) {
                        closeDropdown();
                    }
                });

                // Reposition on scroll/resize
                const repositionHandler = () => positionDropdown();
                const scrollHandler = (e) => {
                    if (itemsContainer && itemsContainer.contains(e.target)) {
                        return; // Allow scrolling inside dropdown
                    }
                    positionDropdown();
                };
                const selectedResizeObserver = new ResizeObserver(() => {
                    positionDropdown();
                });
                
                window.addEventListener('scroll', scrollHandler, true);
                window.addEventListener('resize', repositionHandler);
                selectedResizeObserver.observe(selectedContainer);

                // Store cleanup function
                customSelect._cleanupHandlers = () => {
                    window.removeEventListener('scroll', scrollHandler, true);
                    window.removeEventListener('resize', repositionHandler);
                    selectedResizeObserver.disconnect();
                };
            }
        };

        selectedContainer.addEventListener('click', toggleDropdown);

        // Keyboard support for opening
        selectedContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape' && itemsContainer) {
                closeDropdown();
            }
        });

        // Clean up when element is removed from DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.removedNodes.forEach((node) => {
                    if (node === customSelect || (node.contains && node.contains(customSelect))) {
                        closeDropdown();
                        observer.disconnect();
                    }
                });
            });
        });

        // Start observing once element is in the DOM
        setTimeout(() => {
            if (customSelect.parentNode) {
                observer.observe(customSelect.parentNode, { childList: true, subtree: true });
            }
        }, 0);

        // Initialize
        if (isMultiple) {
            // Populate selectedValues from pre-selected options
            Array.from(select.selectedOptions).forEach(option => {
                selectedValues.add(option.value);
            });
            updateDisplay();
        } else {
            const selectedOption = select.querySelector('option:checked');
            if (selectedOption) {
                updateSingleSelect(selectedOption.textContent);
            } else {
                updateSingleSelect(config.placeholder);
            }
        }

        // Public clear method
        this.clear = function() {
            if (isMultiple) {
                selectedValues.clear();
                checkboxMap.forEach(checkbox => checkbox.checked = false);
                updateDisplay();
            } else {
                select.value = '';
                updateSingleSelect(config.placeholder);
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };
    }

    // Create a wrapper function for backward compatibility
    window.SnapSelect = function(selector, options) {
        const elements = document.querySelectorAll(selector);
        const instances = [];
        elements.forEach(element => {
            const instance = new SnapSelect(element, options);
            instances.push(instance);
        });
        // Return single instance or array of instances
        return instances.length === 1 ? instances[0] : instances;
    };

    // Also expose the constructor directly on window for new usage
    window.SnapSelectClass = SnapSelect;

    // Export SnapSelect for module environments (Node.js, Webpack, etc.)
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = SnapSelect;
    }
})();
