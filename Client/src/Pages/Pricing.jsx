import React, { useState } from 'react';
import { Check, Star, Briefcase, Smartphone, Monitor, TrendingUp, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [selectedService, setSelectedService] = useState('website');
  const navigate = useNavigate();

  const services = [
    {
      id: 'website',
      name: 'Website Development',
      icon: <Briefcase size={24} />,
      description: 'Professional websites and web applications',
      plans: [
        {
          name: 'Basic',
          price: '29,999',
          duration: 'per project',
          features: [
            'Responsive Design',
            'Up to 5 Pages',
            'Contact Form',
            'Basic SEO Setup',
            'Social Media Integration',
            '1 Month Support',
            'Basic Analytics'
          ],
          popular: false,
          color: 'from-blue-500 to-blue-600'
        },
        {
          name: 'Standard',
          price: '44,999',
          duration: 'per project',
          features: [
            'Everything in Basic',
            'Up to 10 Pages',
            'Advanced SEO',
            'Blog Integration',
            'E-commerce Features',
            '3 Months Support',
            'Advanced Analytics',
            'Content Management System'
          ],
          popular: true,
          color: 'from-purple-500 to-purple-600'
        },
        {
          name: 'Premium',
          price: '1,99,999',
          duration: 'per project',
          features: [
            'Everything in Standard',
            'Unlimited Pages',
            'Custom Functionality',
            'Advanced E-commerce',
            'Multi-language Support',
            '12 Months Support',
            'Priority Support',
            'Performance Optimization',
            'Security Audits',
            'Training & Documentation'
          ],
          popular: false,
          color: 'from-indigo-500 to-indigo-600'
        }
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile App Development',
      icon: <Smartphone size={24} />,
      description: 'Native and cross-platform mobile applications',
      plans: [
        {
          name: 'Basic',
          price: '49,999',
          duration: 'per project',
          features: [
            'Single Platform (iOS or Android)',
            'Up to 5 Screens',
            'Basic UI/UX Design',
            'Core Functionality',
            'Basic Testing',
            '1 Month Support',
            'App Store Submission'
          ],
          popular: false,
          color: 'from-green-500 to-green-600'
        },
        {
          name: 'Standard',
          price: '79,999',
          duration: 'per project',
          features: [
            'Everything in Basic',
            'Cross-platform (React Native/Flutter)',
            'Up to 10 Screens',
            'Advanced UI/UX Design',
            'Backend Integration',
            'Push Notifications',
            '3 Months Support',
            'Performance Optimization'
          ],
          popular: true,
          color: 'from-teal-500 to-teal-600'
        },
        {
          name: 'Premium',
          price: '2,49,999',
          duration: 'per project',
          features: [
            'Everything in Standard',
            'Unlimited Screens',
            'Custom Animations',
            'Advanced Backend',
            'Real-time Features',
            'Advanced Analytics',
            '12 Months Support',
            'Priority Support',
            'App Store Optimization',
            'Enterprise Features'
          ],
          popular: false,
          color: 'from-emerald-500 to-emerald-600'
        }
      ]
    },
    {
      id: 'windows',
      name: 'Windows Applications',
      icon: <Monitor size={24} />,
      description: 'Desktop software and enterprise applications',
      plans: [
        {
          name: 'Basic',
          price: '39,999',
          duration: 'per project',
          features: [
            'Single User Application',
            'Basic UI Design',
            'Core Features',
            'Database Integration',
            'Basic Testing',
            '1 Month Support',
            'Installation Package'
          ],
          popular: false,
          color: 'from-purple-500 to-purple-600'
        },
        {
          name: 'Standard',
          price: '69,999',
          duration: 'per project',
          features: [
            'Everything in Basic',
            'Multi-user Support',
            'Advanced UI/UX',
            'Advanced Database',
            'Reporting System',
            '3 Months Support',
            'Performance Monitoring',
            'Backup & Recovery'
          ],
          popular: true,
          color: 'from-indigo-500 to-indigo-600'
        },
        {
          name: 'Premium',
          price: '2,99,999',
          duration: 'per project',
          features: [
            'Everything in Standard',
            'Enterprise Features',
            'Custom Workflows',
            'Advanced Security',
            'API Integration',
            '12 Months Support',
            'Priority Support',
            'Training & Documentation',
            'Custom Modules',
            'Scalability Features'
          ],
          popular: false,
          color: 'from-blue-500 to-blue-600'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Digital Marketing',
      icon: <TrendingUp size={24} />,
      description: 'Comprehensive digital marketing strategies',
      plans: [
        {
          name: 'Basic',
          price: '19,999',
          duration: 'per month',
          features: [
            'Social Media Management (3 platforms)',
            'Content Creation (8 posts/month)',
            'Basic SEO Optimization',
            'Monthly Analytics Report',
            'Email Marketing Setup',
            'Basic Ad Campaigns',
            '1 Month Contract'
          ],
          popular: false,
          color: 'from-orange-500 to-orange-600'
        },
        {
          name: 'Standard',
          price: '39,999',
          duration: 'per month',
          features: [
            'Everything in Basic',
            'Social Media Management (5 platforms)',
            'Content Creation (15 posts/month)',
            'Advanced SEO Strategy',
            'PPC Campaign Management',
            'Influencer Outreach',
            '3 Months Contract',
            'Weekly Analytics',
            'A/B Testing'
          ],
          popular: true,
          color: 'from-red-500 to-red-600'
        },
        {
          name: 'Premium',
          price: '99,999',
          duration: 'per month',
          features: [
            'Everything in Standard',
            'Full Digital Marketing Suite',
            'Unlimited Content Creation',
            'Advanced Analytics & Reporting',
            'Brand Strategy Development',
            'Market Research',
            '12 Months Contract',
            'Dedicated Account Manager',
            'Custom Marketing Tools',
            'ROI Optimization'
          ],
          popular: false,
          color: 'from-pink-500 to-pink-600'
        }
      ]
    },
    {
      id: 'adshoot',
      name: 'Ad Shoot & Production',
      icon: <Camera size={24} />,
      description: 'Professional photography and video production',
      plans: [
        {
          name: 'Basic',
          price: '24,999',
          duration: 'per project',
          features: [
            'Half Day Photography Session',
            'Up to 50 Edited Photos',
            'Basic Retouching',
            '2 Video Clips (30 sec each)',
            'Basic Color Grading',
            '1 Month Support',
            'Digital Delivery'
          ],
          popular: false,
          color: 'from-pink-500 to-pink-600'
        },
        {
          name: 'Standard',
          price: '49,999',
          duration: 'per project',
          features: [
            'Everything in Basic',
            'Full Day Photography Session',
            'Up to 100 Edited Photos',
            'Advanced Retouching',
            '5 Video Clips (1 min each)',
            'Advanced Color Grading',
            '3 Months Support',
            'Multiple Locations',
            'Professional Makeup',
            'Props & Styling'
          ],
          popular: true,
          color: 'from-rose-500 to-rose-600'
        },
        {
          name: 'Premium',
          price: '1,49,999',
          duration: 'per project',
          features: [
            'Everything in Standard',
            'Multi-day Production',
            'Unlimited Photos',
            'Cinematic Video Production',
            'Professional Editing Suite',
            '12 Months Support',
            'Priority Support',
            'Custom Props & Sets',
            'Professional Models',
            'Marketing Materials'
          ],
          popular: false,
          color: 'from-purple-500 to-purple-600'
        }
      ]
    }
  ];

  const currentService = services.find(service => service.id === selectedService);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Transparent Pricing Plans</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Choose the perfect plan for your business needs. All plans include professional quality work, 
              ongoing support, and guaranteed satisfaction.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Select Your Service</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedService === service.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {service.icon}
                <span>{service.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Description */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{currentService.name}</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{currentService.description}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentService.plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-blue-500 scale-105' : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star size={16} className="mr-2 fill-current" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500 ml-2">{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r ${plan.color} hover:shadow-lg transform hover:-translate-y-1`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Included in All Plans?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Quality Assurance</h4>
              <p className="text-sm text-gray-600">Rigorous testing and quality checks</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Ongoing Support</h4>
              <p className="text-sm text-gray-600">Technical support and maintenance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Project Management</h4>
              <p className="text-sm text-gray-600">Dedicated project manager</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Satisfaction Guarantee</h4>
              <p className="text-sm text-gray-600">100% satisfaction guarantee</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
          <p className="text-gray-600 mb-6">
            Contact us for custom pricing and tailored solutions that fit your specific requirements.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
