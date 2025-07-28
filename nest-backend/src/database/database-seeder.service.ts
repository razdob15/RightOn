import { Injectable } from '@nestjs/common';
import { RightsRepository } from '../rights/rights.repository';
import { CreateRightDto } from '../rights/dto/create-right.dto';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly rightsRepository: RightsRepository) {}

  async seedRights(): Promise<void> {
    const count = await this.rightsRepository.count();
    if (count > 0) {
      console.log('Rights already exist in database, skipping seed');
      return;
    }

    const sampleRights: CreateRightDto[] = [
      {
        category: 'משכן',
        name: 'דמי שכירות',
        description: 'זכאות לקבלת סיוע בדמי שכירות עבור חיילים בודדים',
        source: 'משרד הביטחון',
        provider: 'אגף כספים',
        contact: 'טלפון: 03-1234567',
        eligibility: 'חייל בודד פעיל',
        conditions: {
          requirements: ['גיל 18-21', 'שירות פעיל', 'אישור על מעמד חייל בודד'],
          limitations: ['עד 24 חודשים', 'סכום מקסימלי 2000 ש"ח לחודש'],
        },
        implementationProcess: 'הגשת בקשה באגף כספים עם מסמכים נדרשים',
        additionalInfo: 'התשלום מועבר ישירות לבעל הדירה',
      },
      {
        category: 'חינוך',
        name: 'מלגת לימודים',
        description: 'סיוע כספי ללימודים אקדמיים לחיילים משוחררים',
        source: 'משרד החינוך',
        provider: 'וועדת מלגות',
        contact: 'אימייל: scholarships@education.gov.il',
        eligibility: 'חייל משוחרר עד 3 שנים',
        conditions: {
          requirements: [
            'שירות מלא',
            'קבלה למוסד אקדמי מוכר',
            'ממוצע בגרות מעל 80',
          ],
          limitations: ['עד 4 שנות לימוד', 'סכום מקסימלי 15000 ש"ח לשנה'],
        },
        implementationProcess: 'הגשת בקשה אונליין עם אישורי לימודים',
        additionalInfo: 'ניתן לחדש מדי שנה בהתאם להישגים',
      },
      {
        category: 'בריאות',
        name: 'ביטוח בריאות משלים',
        description: 'כיסוי רפואי מורחב לחיילים בודדים',
        source: 'משרד הבריאות',
        provider: 'קופות החולים',
        contact: 'קו חם: *6050',
        eligibility: 'חייל בודד פעיל',
        conditions: {
          requirements: ['אישור על מעמד חייל בודד', 'רישום בקופת חולים'],
          limitations: ['בתוקף במהלך השירות בלבד'],
        },
        implementationProcess: 'פנייה לקופת החולים עם אישור מהצבא',
        additionalInfo: 'כולל כיסוי שיניים ואופטיקה',
      },
    ];

    try {
      const createdRights =
        await this.rightsRepository.bulkCreate(sampleRights);
      console.log(
        `Successfully seeded ${createdRights.length} rights to database`,
      );
    } catch (error) {
      console.error('Failed to seed rights:', error);
    }
  }
}
