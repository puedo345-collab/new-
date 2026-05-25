import { SuccessStory, FAQItem } from './types';

export const QUESTIONS = [
  {
    id: 'occupation',
    title: '현재 직업이나 소득 형태가 어떻게 되시나요?',
    subtitle: '개인회생은 정기적이고 반복적인 소득(최저생계비 이상)이 있을 때 신청 가능합니다.',
    options: [
      { value: 'regular_employee', label: '일반 직장인 (4대 보험 가입)' },
      { value: 'non_regular_employee', label: '일반 직장인 (4대 보험 미가입)' },
      { value: 'business_owner', label: '개인사업자 / 법인대표' },
      { value: 'freelancer_parttime', label: '프리랜서 / 일용직 / 아르바이트' },
      { value: 'no_income', label: '현재 소득 없음 (무직, 주부, 학생 등)' }
    ]
  },
  {
    id: 'debtAmount',
    title: '총 채무액(신용대출, 보증, 사채, 주식 등)은 어느 정도인가요?',
    subtitle: '개인회생은 무담보 채무 10억 원, 담보 채무 15억 원 이하일 때 신청할 수 있으며, 최소 1,000만 원 이상 권장됩니다.',
    options: [
      { value: 'under_10m', label: '1,000만 원 미만' },
      { value: '10m_30m', label: '1,000만 원 ~ 3,000만 원' },
      { value: '30m_50m', label: '3,000만 원 ~ 5,000만 원' },
      { value: '50m_100m', label: '5,000만 원 ~ 1억 원' },
      { value: 'over_100m', label: '1억 원 이상' }
    ]
  },
  {
    id: 'hasMoreDebtThanAssets',
    title: '보유하신 총 재산이 총 채무보다 확실히 적으신가요?',
    subtitle: '본인 소유 예적금, 부동산, 임차보증금, 자동차 등의 가치 합산이 채무 총액보다 적어야 자격이 충족됩니다.',
    options: [
      { value: 'yes', label: '네, 채무가 재산보다 훨씬 많습니다.' },
      { value: 'no', label: '아니오, 재산이 채무보다 더 많습니다.' },
      { value: 'similar', label: '잘 모르겠습니다 / 거의 비슷합니다.' }
    ]
  },
  {
    id: 'region',
    title: '현재 거주하고 계시는 지역은 어디인가요?',
    subtitle: '거주 지역의 관할 회생법원 성향에 따라 심사 기준과 탕감 플랜 가이드라인이 다르게 결정됩니다.',
    options: [
      { value: 'seoul_metropolitan', label: '서울 / 수도권 (인천, 경기 일대)' },
      { value: 'metropolitan_city', label: '5대 광역시 (부산, 대구, 대전, 광주, 울산, 세종)' },
      { value: 'other_region', label: '강원 / 충청 / 전라 / 경상 / 제주 등 기타 지역' }
    ]
  },
  {
    id: 'difficulties',
    title: '현재 본인 상황과 가장 일치하는 고민은 무엇인가요?',
    subtitle: '어려움을 느끼는 상황에 맞춤형 집중 탕감 가이드를 대시보드에 구성해 드립니다. (중복 선택 가능)',
    options: [
      { value: 'recent_loans', label: '최근 대출 및 카드 돌려막기 대폭 증가' },
      { value: 'overwhelming_harassment', label: '채무 독촉 및 빚 추심, 압류의 위협과 스트레스' },
      { value: 'investment_losses', label: '주식, 코인, 무리한 재테크 및 도박 채무 해결' },
      { value: 'secret_process', label: '가족(소속 직장) 몰래 비밀 보장 안전 진행 필요' },
      { value: 'high_interest', label: '높은 고금리 이자 부담 및 채무 악순환' }
    ]
  }
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 1,
    category: '코인/투자 채무',
    title: '코인 투자 실패로 인한 채무 급증 해결',
    age: '20대 후반',
    job: 'IT 프리랜서',
    originalDebt: '6,400만 원',
    reducedDebt: '1,800만 원',
    monthlyPayment: '50만 원 (36개월)',
    reductionRate: 72,
    description: '코인 선물 투자가 어긋나 대부업 대출 및 카드 현금서비스로 돌려막으며 독촉을 받던 중, 법무사 여환동 자격진단 시뮬레이션을 통해 자격을 진단받고, 서울회생법원에 법적 특별 보정을 거쳐 최근 채무임에도 높은 탕감 혜택과 채무 전액 면제를 성공적으로 받았습니다.'
  },
  {
    id: 2,
    category: '생활비/다중채무',
    title: '자녀 교육 및 생활비 다중 카드 대출 탕감',
    age: '40대 중반',
    job: '4대 가입 직장인',
    originalDebt: '8,500만 원',
    reducedDebt: '2,550만 원',
    monthlyPayment: '70만 원 (36개월)',
    reductionRate: 70,
    description: '가계 지출 급증과 코로나19 여파로 다중 채무가 누적되어 매월 원금보다 많은 이자 상환액에 좌절하시던 가장이었습니다. 가용한 소득에서 본인과 부양가족의 보건복지부 고시 최저생계비를 온전히 보장받으면서 70%의 전례 없는 탕감 비중으로 통과하셨습니다.'
  },
  {
    id: 3,
    category: '사업 실패 채무',
    title: '불황으로 폐업하게 된 영세 식음료 가맹점 채무 탕감',
    age: '30대 후반',
    job: '개인사업자 -> 프리랜서 이직',
    originalDebt: '1억 2,000만 원',
    reducedDebt: '2,400만 원',
    monthlyPayment: '66만 원 (36개월)',
    reductionRate: 80,
    description: '매출 상실로 점포를 정리하며 인수받은 임대 보증금 연체와 물품보증 채권으로 빚더미에 올랐으나, 법무사 여환동 사무소와 함께 꼼꼼한 채권 리스트 분석을 거쳐 보유 재산 시가를 보정 받았습니다. 최종 80% 탕감율과 압류 일괄 해제 명령을 이끌어 냈습니다.'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: '울산 거주자가 울산법무사 사무실에서 진행할 때 어떤 장점이 있나요?',
    answer: '울산지방법원의 개인회생 사건을 전문으로 하고 있는 사무실이므로, 울산회생법원 실제 심사관 성향과 고유한 예규 기준에 맞춰 월가용소득 산정을 해 변제계획안을 도출할 뿐만 아니라, 대처하기 힘든 추가 질문이나 보정명령에 지체없이 실시간으로 대처하여 불필요한 청산가치 반영을 최소한으로 방어해 최고의 탕감비율을 이끌어 내며, 언제든 수시로 사무실을 방문해 법무사와 상담이 가능한 장점이 있습니다.'
  },
  {
    id: 2,
    question: '직장이나 가족 모르게 회생을 진행하는 것이 가능한가요?',
    answer: '네, 가능합니다. 저희 법무사 사무소는 모든 우편물 및 법원 특별 송달 서류를 법무사 사무실인 송달장소로 직접 수령하여 의뢰인께 전자 방식(문자 또는 SNS)으로 안내해 드립니다. 이에 따라 소속 회사나 동거 가족들이 해당 상황을 눈치채지 못하도록 100% 철저한 비밀 유지 프로토콜을 보장합니다.'
  },
  {
    id: 3,
    question: '최근 대출이나 주식, 코인, 토토 등으로 발생한 빛도 탕감받나요?',
    answer: '네, 충분히 가능합니다. 최근 주식이나 코인, 가상자산에 따른 과오나 손실 역시 중요한 회생 탕감의 심사 대상입니다. 최근 신설된 회생법원 준칙에 따라 주식 및 코인 등으로 발생한 투자 손실금 자체는 예전처럼 무리해서 전액 청산가치에 반영하지 않는 경우가 많아, 과거 대비 탕감율이 극적으로 높아졌습니다.'
  },
  {
    id: 4,
    question: '신청 및 자가진단 후 채무 독촉은 언제쯤 중단되나요?',
    answer: '회생 자격을 검증한 이후 신속하게 법원에 서류가 접수되면 보통 3대 근무일 내에 법원으로부터 공식 \'금지명령(과 추심정지명령)\'이 송달됩니다. 금지명령이 채권사들에 전달되는 시점부터 일체의 전화 추심, 자택 방문, 독촉 우편, 급여 가압류가 강력히 전면 차단되므로 심리적인 평화를 되찾으실 수 있습니다.'
  }
];
