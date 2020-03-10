# sanity-plugin-wistia

Position input for [Sanity](https://sanity.io/) that stores selected position.

## Installation
In your studio folder, run: 
```
sanity install wistia
```

Then create a config file in  ./config/wistia.json.

The config file has two props:
```json
{
  "wistiaUrl": "wistia-subdomain",
  "apiPassword": "xxxxxxxxxx"
}
```

## Usage

Use it in your schema types:

```js
// [...]
{
  fields: [
    // [...]
    {
      name: 'wistia',
      title: 'Wistia',
      type: 'wistia',
    }
  ]
}
```

Note that the above only works if you import and use the `all:part:@sanity/base/schema-type` part in your schema.

## License

MIT-licensed. See LICENSE.
