/**
 * Healthcare Data Seeding Script
 * Populates the SmartBizFlow system with healthcare industry data
 */

import { HealthcareDatabaseSeeder } from '../src/lib/healthcareSeedData.js';

async function main() {
  try {
    console.log('🏥 Starting Healthcare Data Seeding Process...\n');
    
    // Show data summary
    HealthcareDatabaseSeeder.getHealthcareDataSummary();
    
    console.log('\n🌱 Seeding healthcare data...');
    
    // Seed all healthcare data
    await HealthcareDatabaseSeeder.seedAll();
    
    console.log('\n🎉 Healthcare data seeding completed successfully!');
    console.log('\n📊 Summary of seeded data:');
    HealthcareDatabaseSeeder.getHealthcareDataSummary();
    
    console.log('\n✅ All healthcare modules now have industry-specific data:');
    console.log('  🏥 CRM: Patients, Leads, Medical Records');
    console.log('  🏭 ERP: Medical Equipment, Supplies, Orders, Invoices');
    console.log('  👨‍⚕️ HR: Doctors, Nurses, Medical Training, Leave Management');
    console.log('  💻 IT: Medical IT Assets, Software Licenses, Support Tickets');
    
  } catch (error) {
    console.error('❌ Healthcare data seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding process
main(); 