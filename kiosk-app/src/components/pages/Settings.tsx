import { User, Bell, Shield, Palette } from 'lucide-react';

export function Settings() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and preferences',
      settings: [
        { label: 'Full Name', value: 'Sarah Johnson', type: 'text' },
        { label: 'Email', value: 'sarah.johnson@nexus.com', type: 'email' },
        { label: 'Role', value: 'Senior Retail Associate', type: 'text' },
        { label: 'Department', value: 'Customer Service', type: 'text' }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure how you receive notifications',
      settings: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'Push Notifications', value: true, type: 'toggle' },
        { label: 'SMS Alerts', value: false, type: 'toggle' },
        { label: 'Weekly Reports', value: true, type: 'toggle' }
      ]
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your security preferences',
      settings: [
        { label: 'Two-Factor Authentication', value: true, type: 'toggle' },
        { label: 'Login Alerts', value: true, type: 'toggle' },
        { label: 'Data Sharing', value: false, type: 'toggle' },
        { label: 'Session Timeout', value: '30 minutes', type: 'select' }
      ]
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize your dashboard appearance',
      settings: [
        { label: 'Dark Mode', value: false, type: 'toggle' },
        { label: 'Compact View', value: false, type: 'toggle' },
        { label: 'Show Animations', value: true, type: 'toggle' },
        { label: 'Color Scheme', value: 'Default', type: 'select' }
      ]
    }
  ];

  return (
    <div className="max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-500 text-sm">Customize your dashboard experience</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="flex items-center gap-6">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"
            alt="Sarah Johnson"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">Sarah Johnson</h2>
            <p className="text-sm text-gray-500 mb-4">Senior Retail Associate</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                Change Photo
              </button>
              <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Remove
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">Member since</div>
            <div className="text-sm text-gray-900">January 2023</div>
            <div className="mt-3">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs border border-green-200">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="text-sm text-gray-900">{section.title}</h3>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={settingIndex}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">{setting.label}</div>
                      {setting.type === 'toggle' ? (
                        <button
                          className={`relative w-11 h-6 rounded-full transition-colors ${
                            setting.value
                              ? 'bg-gray-900'
                              : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                              setting.value ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      ) : (
                        <input
                          type={setting.type === 'text' ? 'text' : 'email'}
                          value={setting.value as string}
                          disabled
                          className="flex-1 ml-4 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-900 text-right focus:outline-none"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <button className="px-6 py-2.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
