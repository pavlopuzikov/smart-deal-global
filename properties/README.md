# Properties — How to Update

## Folder Structure

```
properties/
├── ready/          ← Ready (secondary market) property images
│   ├── ready-1.jpg
│   ├── ready-2.jpg
│   ├── ready-3.jpg
│   ├── ready-4.jpg
│   └── ready-5.jpg
└── offplan/        ← Off-plan property images
    ├── offplan-1.jpg
    ├── offplan-2.jpg
    ├── offplan-3.jpg
    ├── offplan-4.jpg
    └── offplan-5.jpg
```

## How to Replace Property Images

1. Drop your property photos into `ready/` or `offplan/` folders
2. Name them `ready-1.jpg`, `ready-2.jpg`, etc. (matching the existing filenames)
3. Recommended size: **600x400px** minimum, landscape orientation
4. Supported formats: JPG, PNG, WebP

## How to Update Property Data

Open `js/main.js` and edit the arrays at the top of the file:

### Ready Properties

Edit the `readyProperties` array. Each property has:

```javascript
{
    name: "Property Name",
    location: "Area, City",
    image: "properties/ready/ready-1.jpg",
    size: "450 sqft",
    bathrooms: 1,
    originalPrice: 950000,
    smartPrice: 836000,
    discount: 12,
    currency: "AED"
}
```

### Off-Plan Properties

Edit the `offplanProperties` array. Each property has:

```javascript
{
    name: "Project Name",
    location: "Area, City",
    image: "properties/offplan/offplan-1.jpg",
    size: "680 sqft",
    bathrooms: 1,
    startingPrice: 1200000,
    currency: "AED",
    paymentPlan: "60/40",
    negotiable: "2-5%"
}
```

## How to Change WhatsApp Number

In `js/main.js`, find this line near the top:

```javascript
const WHATSAPP_NUMBER = "971XXXXXXXXX";
```

Replace `971XXXXXXXXX` with your real number (include country code, no + sign).

## Adding More Properties

Simply add more objects to the arrays. The carousel handles any number of cards automatically. Make sure to add a matching image file.
