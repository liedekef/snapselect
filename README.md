# SnapSelect

**SnapSelect** is a lightweight, customizable, and easy-to-use JavaScript plugin designed to enhance the functionality of HTML `<select>` elements. Inspired by popular select plugins like Select2, TomSelect, and Slim Select, SnapSelect offers a modern and sleek interface with advanced features, while remaining highly configurable and performant.

## Examples
### Multiple select
![image](https://github.com/user-attachments/assets/04e243d0-ab37-400e-b1f9-c2aadc0d3863)


### Non multiple select
![image](https://github.com/user-attachments/assets/cc55dcda-606e-4822-8bd8-8a7cceded4b9)


## Features

- **Live Search:** Enable users to quickly filter options as they type.
- **Ajax call:** Remote data with infinite scrolling.
- **Multi-Select Support:** Allows for multiple selections with intuitive tag management.
- **Optgroup Selection:** Easily select or deselect all options within an optgroup.
- **Clear All Button:** Option to clear all selected options at once (for multi-select).
- **Select All Option:** Add a "Select All" option to quickly select all available options (for multi-select).
- **Customizable Placeholder:** Define custom placeholder text for an empty selection.
- **Custom Search Keywords:** Enhance search functionality with custom keywords for each option.
- **Bootstrap-Inspired Design:** Styled to seamlessly integrate with Bootstrap 5, but easily customizable to match any design system.
- **Accessible:** Built with accessibility in mind, ensuring a better experience for all users.
- **Lightweight:** Minimal footprint, optimized for performance.

## Installation

Include the SnapSelect JavaScript and CSS files in your project:
```html
<link rel="stylesheet" href="/path/to/snapselect/dist/css/snapselect.min.css">
<script src="/path/to/snapselect/dist/js/snapselect.min.js"></script>
```

## Usage

Initialize SnapSelect on your desired `<select>` elements using any selector:

```html
<h3>Select without optgroups</h3>
<!-- Normal Select -->
<label for="selectNormal">Normal Select:</label>
<select id="selectNormal" name="selectNormal" class="snapSelect">
    <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
    <option value="AU" data-key="vegimite Canberra English">Australia</option>
    <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
    <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
    <option value="FR" data-key="croissant Paris French">France</option>
    <option value="IN" data-key="curry New Delhi Hindi">India</option>
    <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
    <option value="NG" data-key="jollof Abuja English">Nigeria</option>
    <option value="RU" data-key="borscht Moscow Russian">Russia</option>
    <option value="ZA" data-key="braai Pretoria English">South Africa</option>
    <option value="ES" data-key="paella Madrid Spanish">Spain</option>
    <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    <option value="US" data-key="hamburger Washington D.C. English">United States</option>
</select>

<!-- Multiple Select -->
<label for="selectMultiple">Multiple Select:</label>
<select id="selectMultiple" name="selectMultiple" multiple class="snapSelect">
    <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
    <option value="AU" data-key="vegimite Canberra English">Australia</option>
    <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
    <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
    <option value="FR" data-key="croissant Paris French">France</option>
    <option value="IN" data-key="curry New Delhi Hindi">India</option>
    <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
    <option value="NG" data-key="jollof Abuja English">Nigeria</option>
    <option value="RU" data-key="borscht Moscow Russian">Russia</option>
    <option value="ZA" data-key="braai Pretoria English">South Africa</option>
    <option value="ES" data-key="paella Madrid Spanish">Spain</option>
    <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    <option value="US" data-key="hamburger Washington D.C. English">United States</option>
</select>

<h3>Select with optgroups</h3>
<!-- Select with Optgroups -->
<label for="selectOptgroupNormal">Normal Select with Optgroups:</label>
<select id="selectOptgroupNormal" name="selectOptgroupNormal" class="snapSelect">
    <optgroup label="Africa">
        <option value="ZA" data-key="braai Pretoria English">South Africa</option>
        <option value="NG" data-key="jollof Abuja English">Nigeria</option>
        <option value="EG" data-key="koshari Cairo Arabic">Egypt</option>
    </optgroup>
    <optgroup label="Asia">
        <option value="CN" data-key="dumplings Beijing Mandarin">China</option>
        <option value="IN" data-key="curry New Delhi Hindi">India</option>
        <option value="JP" data-key="sushi Tokyo Japanese">Japan</option>
    </optgroup>
    <optgroup label="Europe">
        <option value="FR" data-key="croissant Paris French">France</option>
        <option value="ES" data-key="paella Madrid Spanish">Spain</option>
        <option value="GB" data-key="fish and chips London English">United Kingdom</option>
    </optgroup>
    <optgroup label="North America">
        <option value="US" data-key="hamburger Washington D.C. English">United States</option>
        <option value="MX" data-key="tacos Mexico City Spanish">Mexico</option>
        <option value="CA" data-key="poutine Ottawa English">Canada</option>
    </optgroup>
    <optgroup label="South America">
        <option value="BR" data-key="feijoada Brasília Portuguese">Brazil</option>
        <option value="AR" data-key="asado Buenos Aires Spanish">Argentina</option>
        <option value="CO" data-key="arepa Bogotá Spanish">Colombia</option>
    </optgroup>
    <optgroup label="Oceania">
        <option value="AU" data-key="vegimite Canberra English">Australia</option>
        <option value="NZ" data-key="hangi Wellington English">New Zealand</option>
        <option value="FJ" data-key="kokoda Suva English">Fiji</option>
    </optgroup>
</select>

<!-- Multiple Select with Optgroups -->
<label for="selectOptgroupMultiple">Multiple Select with Optgroups and data attributes:</label>
<select id="selectOptgroupMultiple" name="selectOptgroupMultiple" multiple class="snapSelect"
    data-live-search="true" 
    data-placeholder="Choose an option" 
    data-max-selections="3"
    data-clear-all-button="true"
    data-select-optgroups="true"
    data-select-all-option="true"
    data-close-on-select="false"
    data-allow-empty="true">
    <optgroup label="Africa">
        <option value="ZA" data-key="braai Pretoria English">South Africa</option>
        <option value="NG" data-key="jollof Abuja English">Nigeria</option>
        <option value="EG" data-key="koshari Cairo Arabic">Egypt</option>
    </optgroup>
    <!-- ... -->
</select>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        SnapSelect('.snapSelect', {
            liveSearch: true,
            placeholder: 'Select an option...',
            clearAllButton: true,
            selectOptgroups: true,
            selectAllOption: true,
            closeOnSelect: false,
            maxSelections: 10,
            allowEmpty: true
        });
    });
</script>
```

### AJAX — basic remote data

Use the `ajax` option to load options from a remote endpoint. The select element can be left empty; SnapSelect will populate it on open.

```html
<select id="selectAjax" data-placeholder="Search users..."></select>

<script>
    SnapSelect('#selectAjax', {
        liveSearch: true,
        ajax: {
            url: '/api/users',
            processResults: function(response) {
                return {
                    results: response.data,   // array of { id, text }
                    hasMore: response.meta.hasMore
                };
            }
        }
    });
</script>
```

The server receives `q` (search term), `page`, and `pagesize` as query parameters on every request:

```
GET /api/users?q=john&page=1&pagesize=20
```

Expected response shape:
```json
{
    "data": [
        { "id": 1, "text": "John Doe" },
        { "id": 2, "text": "John Smith" }
    ],
    "meta": { "hasMore": true }
}
```

### AJAX — with extra parameters and POST

Use `data` to pass extra parameters (as a plain object or a function), and `method` to switch to POST. For POST requests, parameters are sent as `multipart/form-data`, which is compatible with traditional server frameworks like WordPress:

```html
<select id="selectAjaxPost" data-placeholder="Search products..."></select>

<script>
    // Plain object — same extra params on every request
    SnapSelect('#selectAjaxPost', {
        ajax: {
            url: '/api/products/search',
            method: 'POST',
            data: {
                category: 'electronics',
                inStock: true
            },
            processResults: function(response) {
                return {
                    results: response.items,
                    hasMore: response.hasNextPage
                };
            }
        }
    });

    // Function — extra params can vary per search/page
    SnapSelect('#selectAjaxPost', {
        ajax: {
            url: '/api/products/search',
            method: 'POST',
            data: function(searchTerm, page) {
                return {
                    category: document.getElementById('categoryFilter').value
                };
            },
            processResults: function(response) {
                return {
                    results: response.items,
                    hasMore: response.hasNextPage
                };
            }
        }
    });
</script>
```

### AJAX — dynamic URL (country → state cascade)

The `url` option accepts a function, making dependent dropdowns straightforward:

```html
<select id="country" data-placeholder="Select country..."></select>
<select id="state"   data-placeholder="Select state..." disabled></select>

<script>
    SnapSelect('#country', {
        ajax: {
            url: '/api/countries',
            processResults: r => ({ results: r.data, hasMore: r.meta.hasMore })
        }
    });

    document.getElementById('country').addEventListener('change', function() {
        const stateEl = document.getElementById('state');
        stateEl.disabled = !this.value;
        SnapSelect('#state', {
            ajax: {
                url: (search, page) => `/api/states?country=${this.value}&q=${search}&page=${page}`,
                processResults: r => ({ results: r.data, hasMore: r.meta.hasMore })
            }
        });
    });
</script>
```

### AJAX — custom headers and minimum input length

```javascript
SnapSelect('#selectAjax', {
    ajax: {
        url: '/api/search',
        minimumInputLength: 2,   // only fetch after 2 characters are typed
        delay: 400,              // debounce delay in ms
        headers: {
            'Authorization': 'Bearer my-token',
            'X-Custom-Header': 'value'
        },
        processResults: function(response) {
            return { results: response.results, hasMore: false };
        }
    }
});
```

---

## Supported Data Attributes

-   `data-live-search="true|false"` (boolean): Enables or disables the search functionality.
-   `data-max-selections="number"` (number): Sets the maximum number of selections allowed.
-   `data-max-items="number"` (number): Alias for `data-max-selections`.
-   `data-placeholder="text"` (string): Sets the placeholder text when no option is selected.
-   `data-clear-all-button="true|false"` (boolean): Shows or hides the "Clear All" button.
-   `data-select-optgroups="true|false"` (boolean): Allows or disallows selecting all options within an optgroup.
-   `data-select-all-option="true|false"` (boolean): Adds or removes the "Select All" option.
-   `data-close-on-select="true|false"` (boolean): Closes or keeps open the dropdown after selection.
-   `data-allow-empty="true|false"` (boolean): Allows or disallows deselection in single select mode.

## Configuration Options

### Core options

-   `liveSearch` (boolean): Enable live search functionality. Default: `false`.
-   `maxSelections` (number): Maximum number of selections allowed (for multi-select). Alias: `maxItems`. Default: `Infinity`.
-   `placeholder` (string): Custom placeholder text. Default: `'Select...'`.
-   `clearAllButton` (boolean): Show a "Clear All" button for multi-select. Default: `false`.
-   `selectOptgroups` (boolean): Allow selecting/deselecting all options within an optgroup. Default: `false`.
-   `selectAllOption` (boolean): Add a "Select All" option for multi-select. Default: `false`.
-   `closeOnSelect` (boolean): Close the dropdown after each selection (single-select only). Default: `true`.
-   `allowEmpty` (boolean): Allow deselecting the current value (for single select). Default: `false`.

### AJAX options

-   `ajax` (object): Enables remote data loading. When set, the dropdown fetches options from a server instead of reading them from the HTML. Default: `null`.
    -   `url` (string|function): The endpoint URL, or a function `(searchTerm, page) => string` for dynamic URLs.
    -   `method` (string): HTTP method. Default: `'GET'`.
    -   `data` (object|function): Optional. A plain object of extra parameters, or a function `(searchTerm, page) => object`, merged into every request.
    -   `processResults` (function): **Required.** Maps the raw server response to `{ results: [{id, text}], hasMore: bool }`.
    -   `delay` (number): Debounce delay in ms before firing a search request. Default: `300`.
    -   `minimumInputLength` (number): Minimum number of characters required before fetching. Default: `0`.
    -   `cache` (boolean): Cache results per (search + page) key to avoid redundant requests. Default: `true`. Always false if `url` or `data` is a function.
    -   `headers` (object): Extra HTTP headers to include in every request. Default: `{}`.
    -   `pagesize` (number): Number of items per page sent to the server. Default: `20`.
    -   `loadingText` (string): Text shown in the dropdown while loading. Default: `'Loading...'`.
    -   `noResultsText` (string): Text shown when no results are returned. Default: `'No results found'`.
    -   `errorText` (string): Text shown when the request fails. Default: `'Error loading results'`.

## Public Methods

After initialisation, SnapSelect returns an instance with the following methods:

```javascript
const select = SnapSelect('#mySelect', { /* options */ });

// Clear the current selection
select.clear();

// Force a fresh AJAX fetch (clears cache for the current search term)
select.refresh();

// Clear the entire AJAX response cache
select.clearCache();
```

## Form Validation

SnapSelect respects the native `required` attribute. When a required field is submitted empty, the widget highlights the select with a `snap-select-invalid` class on the `.snap-select-selected` element and renders a validation message below the widget using `.snap-select-validation-message`. Both classes can be styled freely in your CSS.

```html
<select id="selectRequired" name="category" required data-placeholder="Select a category...">
    <option value=""></option>
    <option value="1">Option A</option>
    <option value="2">Option B</option>
</select>
```

The validation message text is sourced from the browser's own `validationMessage`, so it is automatically localised.

## Accessibility (ARIA)

SnapSelect is designed with accessibility in mind and includes ARIA attributes to enhance usability with assistive technologies.

-   The main container is set as `role="combobox"` with `aria-expanded` and `aria-haspopup` attributes.
-   The items container is set as `role="listbox"`.
-   Selected items are dynamically updated with `aria-live="polite"` for screen reader notifications.

## Compatibility and Polyfills

SnapSelect includes polyfills to support older browsers:

-   `classList` Polyfill: Adds support for classList manipulation on elements.
-   `addEventListener` Polyfill: Adds support for addEventListener on elements.

These polyfills ensure that SnapSelect works across a wide range of browsers, including older versions of Internet Explorer.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features, bug fixes, or improvements.

## License

SnapSelect is released under the MIT License. See the LICENSE file for more details.
Feel free to use in any condition and modify all as you want.
