import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface PricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Header -->
      <section class="bg-white border-b border-gray-100 py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Give your team the knowledge they need to succeed. Choose the plan that works best for your goals.
          </p>
          
          <!-- Monthly/Yearly Toggle -->
          <div class="mt-10 flex items-center justify-center gap-4">
            <span [class.text-gray-900]="!isYearly" [class.text-gray-500]="isYearly" class="text-sm font-medium">Monthly</span>
            <button 
              (click)="isYearly = !isYearly"
              class="relative w-14 h-7 bg-gray-200 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              [class.bg-primary]="isYearly"
            >
              <span 
                class="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm"
                [style.transform]="isYearly ? 'translateX(28px)' : 'translateX(0)'"
              ></span>
            </button>
            <span [class.text-gray-900]="isYearly" [class.text-gray-500]="!isYearly" class="text-sm font-medium flex items-center gap-2">
              Yearly
              <span class="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Pricing Cards -->
      <section class="py-20">
        <div class="container mx-auto px-4">
          <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            @for (plan of plans; track plan.name) {
              <div 
                class="relative bg-white rounded-3xl p-8 shadow-card border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-card-hover"
                [class.border-primary]="plan.isPopular"
                [class.scale-105]="plan.isPopular"
                [class.z-10]="plan.isPopular"
              >
                @if (plan.isPopular) {
                  <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    MOST POPULAR
                  </div>
                }

                <div class="mb-8">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
                  <p class="text-gray-500 text-sm italic">{{ plan.description }}</p>
                </div>

                <div class="mb-8">
                  <div class="flex items-baseline gap-1">
                    <span class="text-4xl font-bold text-gray-900">$</span>
                    <span class="text-6xl font-bold text-gray-900">{{ isYearly ? calculateYearly(plan.price) : plan.price }}</span>
                    <span class="text-gray-500">/mo</span>
                  </div>
                  @if (isYearly) {
                    <p class="text-xs text-green-600 font-medium mt-1">Billed annually ($ {{ calculateYearly(plan.price) * 12 }} / yr)</p>
                  }
                </div>

                <div class="flex-1 space-y-4 mb-8">
                  @for (feature of plan.features; track feature) {
                    <div class="flex items-start gap-3">
                      <div class="mt-1 flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <svg class="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-600 text-sm leading-tight">{{ feature }}</span>
                    </div>
                  }
                </div>

                <app-button 
                  [variant]="plan.isPopular ? 'primary' : 'outline'" 
                  class="w-full"
                  size="lg"
                >
                  {{ plan.ctaText }}
                </app-button>
              </div>
            }
          </div>
        </div>
      </section>


    </div>
  `,
  styles: []
})
export class PricingComponent {
  isYearly = false;

  plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for exploring the platform.',
      features: [
        'Access to 5 free courses',
        'Basic course materials',
        'Community forum access',
        'Email support'
      ],
      ctaText: 'Start for Free'
    },
    {
      name: 'Pro',
      price: 29,
      description: 'Ideal for serious learners.',
      features: [
        'Access to all 500+ courses',
        'Premium course materials',
        'Live Q&A sessions',
        'Certification of completion',
        'Priority email support',
        'Offline viewing mode'
      ],
      isPopular: true,
      ctaText: 'Get Started with Pro'
    },
    {
      name: 'Enterprise',
      price: 99,
      description: 'For teams and organizations.',
      features: [
        'Everything in Pro plan',
        'Custom learning paths',
        'Team analytics dashboard',
        'Dedicated account manager',
        'API access for integrations',
        'SSO Authentication'
      ],
      ctaText: 'Contact Sales'
    }
  ];

  calculateYearly(monthlyPrice: number): number {
    return Math.floor(monthlyPrice * 0.8); // 20% discount
  }
}
