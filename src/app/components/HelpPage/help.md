# Using TILed Editor 📕

TILed editor is a markdown editor, that allows you to edit live.
Currently limted amount of markdown features can be live transformed, but it does not limit you to not use markdown.

## Features 🦄

-   Blockquote
-   Code block (inline)
-   Code block (triple backticks)
-   Header
-   Bold
-   Italic
-   Bold + Italic
-   Strikethrough
-   Hr
-   Link
-   Image
-   Unordered List
-   Ordered List

### Blockquote

```
>[space]Blockquote
```

### Code block (inline)

```
[space * 4]Code block
```

### Code block (triple backticks)

```
[` * 3][space] Code block
```

Use specific language:

```
[` * 3][lang][space] Code block
```

for example:

```js
const wow = test();
```

<kbd>CMD</kbd>+<kbd>Enter</kbd>: to exit code block

### Header

```
[# * 1~6][space] Header
```

Example

```
# h1
## h2
### h3
#### h4
##### h5
###### h6
```

### Bold

```
**strong**[space]
or
__strong__[space]
```

### Italic

```
_italic_[space]
or
*italic*[space]
```

### Bold + Italic

```
___[strong + italic]___[space]
or
***[strong + italic]***[space]
```

### Strikethrough

```
~[strikethrough]~[space]
```

### Hr

```
***
or
---
```

### Link

```
[example](http://example.com "Optional title")[space]
```

### Image

```
![example](http://example.com "Optional title")[space]
```

### Unordered list

```
*[space]
or
+[space]
or
-[space]
```

### Ordered List

```
1.[space]
```

---

## Bugs or features 🐛

TILed is currenly in alpha and only supports sharing on Github Gist. Future plans are to create a personal feed and share it on multiple platforms like twitter or any platform which exposes APIs to create Posts.

If you find anything buggy or fishy please create an issue [here](here).
Thanks a ton! ✌️

todo: add how to start, github gist etc.
