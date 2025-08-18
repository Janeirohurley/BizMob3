# BizMob - Digital Business Notebook

BizMob is an offline-first mobile web application designed for small business management. It functions as a digital notebook without requiring internet connection or user registration.

## Features

### 📱 Core Features
- **Offline First**: No internet connection required
- **No Registration**: Start using immediately without accounts
- **Multi-language Support**: English, French, Spanish, and Arabic
- **Mobile Optimized**: Responsive design for mobile devices
- **Multi-currency Support**: Configurable currency symbols

### 💼 Business Management
- **Inventory Management**: Track products with purchase and sale prices
- **Sales Tracking**: Multi-item sales with intelligent stock verification
- **Purchase Recording**: Track supplier purchases with initial sale prices
- **Client Management**: Automatic client ranking by purchase frequency
- **Debt Management**: Track and manage client debts with payment history

### 📊 Analytics & Reporting
- **Dashboard**: Real-time business overview
- **Reports**: Profit analysis and business insights
- **Transaction History**: Complete business transaction log
- **Client Analytics**: Detailed client purchase history

### 🔒 Data Management
- **Local Storage**: All data stored locally on device
- **Data Export**: Backup your business data as JSON
- **Data Import**: Restore from backup files
- **Privacy First**: No data sent to external servers

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Local Development

1. **Clone or Download** the project files
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open your browser** and navigate to `http://localhost:3000`

### Production Build

1. **Build the application**:
   ```bash
   npm run build
   ```
2. **Preview the build**:
   ```bash
   npm run preview
   ```
3. **Deploy** the `dist` folder to your web server

## Usage Guide

### Initial Setup
1. Open the application
2. Enter your business name and user name
3. Create a secure password
4. Configure your preferred currency
5. Select your language

### Managing Products & Inventory
1. **Add Purchase**: Record product purchases with initial sale price
2. **Check Stock**: View current inventory levels
3. **Set Prices**: Define purchase and sale prices for each product

### Recording Sales
1. **Select Products**: Choose from available inventory
2. **Set Quantities**: Automatic stock verification
3. **Choose Payment**: Full payment, partial, or debt
4. **Client Tracking**: Automatic client management

### Debt Management
1. **Track Debts**: Automatic debt calculation
2. **Record Payments**: Track partial and full payments
3. **Payment History**: Complete payment transaction log
4. **Client Updates**: Automatic client debt updates

### Data Backup
1. **Export Data**: Download complete business backup as JSON
2. **Import Data**: Restore from previous backup
3. **Offline Storage**: All data stored locally

## Technical Specifications

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **PWA**: Service Worker support

### Browser Support
- Chrome/Chromium (recommended)
- Safari (iOS/macOS)
- Firefox
- Edge

### Storage Requirements
- **Minimal**: ~1MB for application code
- **Data**: Varies with business size (typically 10-100KB)
- **Offline**: Complete offline functionality

## File Structure

```
bizmob/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── AddPurchase.tsx  # Purchase recording
│   ├── AddSale.tsx      # Sales recording
│   ├── Clients.tsx      # Client management
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Debts.tsx        # Debt management
│   ├── History.tsx      # Transaction history
│   ├── Reports.tsx      # Business reports
│   └── Settings.tsx     # App configuration
├── styles/
│   └── globals.css      # Global styles
├── App.tsx              # Main application
├── main.tsx            # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.ts      # Build configuration
└── README.md           # This file
```

## Configuration

### Currency Configuration
- Default: USD ($)
- Configurable in Settings
- Supports any currency symbol
- Applies to all monetary displays

### Language Configuration
- Supported: English, French, Spanish, Arabic
- RTL support for Arabic
- Automatic language persistence
- Change anytime in Settings

### Data Configuration
- Local storage only
- No external API calls
- Automatic data validation
- Backward compatibility

## Contributing

This is an open-source project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## Roadmap

### Planned Features
- [ ] Receipt generation
- [ ] Advanced reporting
- [ ] Data sync between devices
- [ ] Barcode scanning
- [ ] Multi-business support

### Known Limitations
- Single business per installation
- No cloud synchronization
- No multi-user support
- No receipt printing

## Security

- **Local Only**: No data transmission
- **Password Protected**: Local authentication
- **No Analytics**: No tracking or monitoring
- **Private**: Your data stays on your device

---

**BizMob** - Simple business management for everyone. No internet required, no accounts needed, just business tracking that works.