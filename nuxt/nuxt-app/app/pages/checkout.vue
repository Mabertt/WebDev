<script setup>
import { reactive, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSubscriptionStore } from '../../stores/useSubscriptionStore'

const subscriptionStore = useSubscriptionStore()

useHead({
  title: 'Checkout'
});

// Load plans on mount
onMounted(() => {
  if (!subscriptionStore.availablePlans.length) {
    subscriptionStore.fetchPlans()
  }
})

const { selectedPlan, isLoading, error, trialDays, termsUrl, supportPhone } = storeToRefs(subscriptionStore)

const form = reactive({
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  fullName: '',
  address: '',
  consent: false
});

const isSubmitting = ref(false);
const submitError = ref(null);
const submitSuccess = ref(false);

const formatCardNumber = (value) => {
  return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
};

const formatExpiryDate = (value) => {
  const cleaned = value.replace(/\D/g, '').substring(0, 4);
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
  }
  return cleaned;
};

const onCardNumberInput = (event) => {
  form.cardNumber = formatCardNumber(event.target.value);
};

const onExpiryDateInput = (event) => {
  form.expiryDate = formatExpiryDate(event.target.value);
};

const onSubmit = async () => {
  if (!form.consent) {
    submitError.value = 'You must consent to the Terms of Use';
    return;
  }

  if (!selectedPlan.value) {
    submitError.value = 'No plan selected';
    return;
  }

  isSubmitting.value = true;
  submitError.value = null;
  submitSuccess.value = false;

  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: {
        planId: selectedPlan.value.id,
        cardNumber: form.cardNumber.replace(/\s/g, ''),
        expiryDate: form.expiryDate,
        cvc: form.cvc,
        fullName: form.fullName,
        address: form.address,
        consent: form.consent
      }
    });

    if (response.success) {
      submitSuccess.value = true;
    }
  }
  catch (err) {
    submitError.value = err.statusMessage || 'An error occurred';
  }
  finally {
    isSubmitting.value = false;
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

const goBack = () => {
  navigateTo('/');
};
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="bg-[#3a3a3a] text-white py-3">
      <div class="max-w-5xl mx-auto px-4 text-center">
        <h1 class="text-base font-normal">Checkout</h1>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-6">
      <!-- Back link -->
      <button
        @click="goBack"
        class="text-gray-500 hover:text-gray-700 text-sm mb-6 inline-block"
      >
        &lt;&lt; back
      </button>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <p class="text-gray-500">Loading...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <template v-else-if="selectedPlan">
        <!-- Title section -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-1">
            You're Almost In - Start Your {{ trialDays }}-Day Free Trial Now!
          </h2>
          <p class="text-sm text-gray-600">
            Set up your account to gain instant access! You won't be charged if you decide to cancel within {{ trialDays }} days
          </p>
        </div>

        <!-- Alerts -->
        <div v-if="submitSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <p class="font-medium">Success! Subscription created.</p>
        </div>

        <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {{ submitError }}
        </div>

        <!-- Two columns -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left column - Plan -->
          <div class="bg-white rounded-lg shadow-lg border-t-4 border-[#22c55e] p-5">
            <h3 class="text-base font-semibold text-gray-900 mb-4">
              {{ selectedPlan.name }}
            </h3>

            <div class="mb-4">
              <p class="text-xs text-gray-500 mb-1">{{ trialDays }}-days free then:</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ subscriptionStore.monthlyPriceFormatted }}<span class="text-sm font-normal text-gray-600">/month</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">
                billed yearly at <span class="line-through text-gray-400">{{ formatCurrency(selectedPlan.originalYearlyPrice) }}</span> {{ subscriptionStore.yearlyPriceFormatted }}
              </p>
              <span class="inline-block mt-2 bg-[#dcfce7] text-[#166534] text-xs px-2 py-0.5 rounded">
                {{ subscriptionStore.savingsFormatted }} in savings
              </span>
            </div>

            <hr class="border-gray-200 my-4" />

            <ul class="space-y-2 text-sm">
              <li
                v-for="(feature, index) in selectedPlan.features"
                :key="index"
                class="flex items-start"
              >
                <span class="text-[#22c55e] mr-2 text-xs mt-0.5">?</span>
                <span class="text-gray-700 text-sm">
                  {{ feature.text }}
                  <span v-if="feature.subtext" class="block text-xs text-gray-500">{{ feature.subtext }}</span>
                </span>
              </li>
            </ul>
          </div>

          <!-- Right column - Order Summary & Form -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 class="text-base font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div class="space-y-2 text-sm mb-4">
              <div class="flex justify-between">
                <span class="text-gray-700">Annual Plan</span>
                <span class="text-gray-900">{{ subscriptionStore.yearlyPriceFormatted }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-700 text-xs">
                  Total Due <span class="text-gray-400">(*not including sales tax where applicable)</span>
                </span>
                <span class="text-gray-900">{{ subscriptionStore.yearlyPriceFormatted }}</span>
              </div>
              <div class="flex justify-between font-medium">
                <span class="text-gray-700">Due Today</span>
                <span class="text-gray-900">{{ formatCurrency(0) }}</span>
              </div>
            </div>

            <div class="bg-gray-100 rounded p-2 text-center mb-5">
              <p class="text-sm text-gray-700">Includes {{ trialDays }}-Day Free Trial</p>
            </div>

            <h3 class="text-base font-semibold text-gray-900 mb-3">
              Billing Information
              <span class="text-gray-400 text-xs ml-1 cursor-help" title="Secure billing">ⓘ</span>
            </h3>

            <form @submit.prevent="onSubmit" class="space-y-3">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Card Details</label>
                <div class="flex border border-gray-300 rounded overflow-hidden">
                  <div class="flex items-center px-2 bg-white border-r border-gray-300">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.cardNumber"
                    type="text"
                    placeholder="Number"
                    class="flex-1 px-3 py-2 text-sm outline-none"
                    maxlength="19"
                    @input="onCardNumberInput"
                  />
                  <input
                    v-model="form.expiryDate"
                    type="text"
                    placeholder="MM / YY"
                    class="w-20 px-3 py-2 text-sm outline-none border-l border-gray-300"
                    maxlength="5"
                    @input="onExpiryDateInput"
                  />
                  <input
                    v-model="form.cvc"
                    type="password"
                    placeholder="CVC"
                    class="w-16 px-3 py-2 text-sm outline-none border-l border-gray-300"
                    maxlength="3"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs text-gray-600 mb-1">Address</label>
                <input
                  v-model="form.fullName"
                  type="text"
                  placeholder="Full name"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 outline-none focus:border-gray-400"
                />
                <textarea
                  v-model="form.address"
                  placeholder="Address"
                  rows="2"
                  class="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
                ></textarea>
              </div>

              <div class="flex items-start">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  class="mt-0.5 mr-2"
                />
                <label class="text-xs text-gray-600 leading-relaxed">
                  I consent to <a href="#" class="text-gray-900 underline">Terms of Use</a> and understand my {{ trialDays }}-day free trial will automatically convert to {{ subscriptionStore.yearlyPriceFormatted }} per year starting on 04/02/2026. The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling {{ supportPhone }}.
                </label>
              </div>

              <button
                type="submit"
                class="w-full bg-[#d1d5db] hover:bg-[#9ca3af] text-gray-700 font-medium py-2.5 px-4 rounded transition-colors"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Processing...</span>
                <span v-else>Try It Free</span>
              </button>
            </form>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
