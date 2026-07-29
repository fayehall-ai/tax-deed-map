// State-level content transcribed from the user's source document:
//   "50 State Tax Sale Data - Faye.docx" / "TDC 50-State Report on Real
//   Property Tax Auction Systems" (the report's own citations are dated
//   "accessed July 7, 2025").
//
// This file is a TRANSCRIPTION, not independent research. Nothing here was
// verified against the statutes or the counties - it reproduces what the
// document says, so the UI attributes it to the document rather than
// presenting it as the atlas's own checked work. STATE_DATA in state-data.js
// remains the app's own summary; this is shown alongside it, not merged into
// it, so the two provenances stay distinguishable.
//
// Coverage is complete: all 50 states have both the Table 1 summary row and
// a full detailed section (classification, governing statutes, system
// overview, statutory framework, state-level resources).
//
// An earlier .doc version of this report stopped inside New Jersey and left
// 20 states (New Mexico -> Wyoming) with no detailed section; that version is
// superseded here. If a state ever lacks detail again, the UI still degrades
// to a summary-only note rather than implying the entry is complete.
//
// Extraction notes: the source mixes two bullet conventions ("\t*\t" for the
// earlier sections, "*"/"o" for the later ones), so lines are normalised
// before heading matching. Superscript footnote markers ("expires.1", "0%.4")
// were stripped. Keyed by USPS state abbreviation.

const STATE_DOC_SOURCE = {
  title: "TDC 50-State Report on Real Property Tax Auction Systems",
  file: "50 State Tax Sale Data - Faye.docx",
  citationsAccessed: "2025-07-07",
};


// Table 1 - all 50 states.
const STATE_DOC_SUMMARY = {
  AL: { type: "Hybrid (Tax Lien / Redeemable Deed)", rate: "Lien: Bid-down from 12%. Deed: 12% per annum.", redemption: "3 Years" },
  AK: { type: "Tax Deed", rate: "N/A (Pre-sale repurchase right)", redemption: "None (Post-sale)" },
  AZ: { type: "Tax Lien", rate: "Bid-down from 16% per annum", redemption: "3 Years" },
  AR: { type: "Tax Deed", rate: "N/A (Pre-sale redemption)", redemption: "30 Days (Post-sale)" },
  CA: { type: "Tax Deed", rate: "N/A", redemption: "None (Redemption ends day before sale)" },
  CO: { type: "Tax Lien", rate: "9 points above Fed. discount rate (15% for 2024)", redemption: "3 Years" },
  CT: { type: "Hybrid (Redeemable Deed / Lien Assignment)", rate: "18% per annum", redemption: "6 Months (Standard)" },
  DE: { type: "Redeemable Deed", rate: "15% premium on bid amount", redemption: "Approx. 90 Days (Until court confirmation)" },
  FL: { type: "Hybrid (Tax Lien followed by Tax Deed)", rate: "Lien: Bid-down from 18%. Deed App: 1.5% per month.", redemption: "2 Years (for lien)" },
  GA: { type: "Redeemable Deed", rate: "20% premium (1st year), 10% thereafter", redemption: "1 Year" },
  HI: { type: "Redeemable Deed", rate: "12% per annum on purchase price", redemption: "1 Year" },
  ID: { type: "Tax Deed", rate: "N/A", redemption: "None (Redemption ends at time of sale)" },
  IL: { type: "Tax Lien", rate: "Bid-down from 18% (penalty, not interest)", redemption: "2 to 3 Years (Varies by property type)" },
  IN: { type: "Tax Lien", rate: "10%−15% penalty on min. bid; 5% per annum on overbid", redemption: "1 Year (Standard); 120 Days (Commissioner's Sale)" },
  IA: { type: "Tax Lien", rate: "2% per month", redemption: "1 Year, 9 Months (before deed process starts)" },
  KS: { type: "Tax Deed", rate: "N/A", redemption: "Ends day before auction" },
  KY: { type: "Tax Lien", rate: "Varies by county; often includes penalties + interest", redemption: "1 Year" },
  LA: { type: "Redeemable Deed", rate: "1% per month + 5% penalty", redemption: "3 Years" },
  ME: { type: "Tax Deed", rate: "N/A (Pre-sale redemption)", redemption: "None (Post-sale, varies by municipality)" },
  MD: { type: "Tax Lien", rate: "Varies by county (6% to 20% per annum)", redemption: "6 Months (before foreclosure can start)" },
  MA: { type: "Tax Lien", rate: "Bid-down interest rate from 16%", redemption: "6 Months (before foreclosure can start)" },
  MI: { type: "Tax Deed", rate: "N/A", redemption: "None (Foreclosure precedes sale)" },
  MN: { type: "Tax Deed", rate: "N/A", redemption: "None (Foreclosure precedes sale)" },
  MS: { type: "Tax Lien", rate: "1.5% per month", redemption: "2 Years" },
  MO: { type: "Redeemable Deed", rate: "10% on purchase price + costs", redemption: "90 Days to 2 Years (Varies by county class)" },
  MT: { type: "Tax Lien", rate: "2% penalty + 5/6 of 1% per month", redemption: "2 to 3 Years (Until deed application)" },
  NE: { type: "Tax Lien", rate: "14% per annum", redemption: "3 Years" },
  NV: { type: "Tax Deed", rate: "N/A", redemption: "None (2-year protest period)" },
  NH: { type: "Tax Deed", rate: "N/A", redemption: "None (Redemption ends upon deeding)" },
  NJ: { type: "Tax Lien", rate: "Bid-down from 18% per annum", redemption: "2 Years" },
  NM: { type: "Tax Deed", rate: "N/A", redemption: "None (2-year challenge period)" },
  NY: { type: "Hybrid (Tax Lien / Tax Deed)", rate: "Varies by county/city (NYC: 5%−18%)", redemption: "1 to 2 Years (Varies)" },
  NC: { type: "Tax Deed", rate: "N/A", redemption: "None (10-day upset bid period)" },
  ND: { type: "Tax Deed", rate: "N/A", redemption: "Varies; typically ends before sale" },
  OH: { type: "Hybrid (Tax Lien / Tax Deed)", rate: "Lien: up to 18% per annum. Deed: N/A", redemption: "1 Year (Lien); None (Deed)" },
  OK: { type: "Tax Deed", rate: "N/A", redemption: "Ends upon execution of deed" },
  OR: { type: "Redeemable Deed", rate: "9% per annum on judgment amount", redemption: "2 Years" },
  PA: { type: "Tax Deed", rate: "N/A", redemption: "None (Post Upset Sale)" },
  RI: { type: "Redeemable Deed", rate: "10% penalty + 1% per month after 6 months", redemption: "1 Year" },
  SC: { type: "Redeemable Deed", rate: "3%−12% tiered premium based on time", redemption: "1 Year" },
  SD: { type: "Tax Lien", rate: "10% per annum", redemption: "3 to 4 Years" },
  TN: { type: "Redeemable Deed", rate: "12% per annum", redemption: "1 Year" },
  TX: { type: "Tax Deed", rate: "N/A", redemption: "6 Months to 2 Years (Varies by property type)" },
  UT: { type: "Tax Deed", rate: "N/A", redemption: "None (Redemption ends at sale)" },
  VT: { type: "Redeemable Deed", rate: "1% per month", redemption: "1 Year" },
  VA: { type: "Tax Deed", rate: "N/A", redemption: "None (Post-sale)" },
  WA: { type: "Tax Deed", rate: "N/A", redemption: "None (Foreclosure precedes sale)" },
  WV: { type: "Hybrid (Tax Lien followed by Tax Deed)", rate: "12% per annum", redemption: "18 Months (for lien)" },
  WI: { type: "Tax Deed", rate: "N/A", redemption: "Varies" },
  WY: { type: "Tax Lien", rate: "3% penalty + 15% per annum", redemption: "4 Years" },
};

// Detailed analysis - all 50 states.
const STATE_DOC_DETAIL = {
  AL: {
    classification: "Hybrid",
    governingStatutes: "Alabama Code Title 40, Chapter 10",
    redemptionPeriod: "A uniform redemption period of 3 years from the date of the tax sale applies to both the Sale of Land and Sale of Lien systems. After this period, the property owner's right to redeem through the county is extinguished.",
    interestRate: "The applicable rate depends entirely on the system used by the county. Sale of Land (Redeemable Deed): The redemption amount includes the original purchase price plus interest at a fixed rate of 12% per annum. The redeeming party must also reimburse the purchaser for any subsequent property taxes they have paid, plus interest on those subsequent payments. Sale of Lien (Tax Lien): The interest rate is not fixed but is determined by the competitive \"bid-down\" auction. The maximum rate is 12% per annum, and the lien is awarded to the bidder accepting the lowest rate. The interest paid upon redemption is calculated at the winning bid rate.",
    overview: [
      "Alabama operates a hybrid system where individual counties have the authority to choose between two distinct methods for handling delinquent real property taxes: a \"Sale of Land\" or a \"Sale of Lien\". This dual-system approach was established by legislative changes in 2018, with the sale of liens first being implemented in 2019.",
      "The Sale of Land is the state's traditional method and functions as a Redeemable Deed system. In this process, the county auctions the property itself to the highest bidder. The purchaser acquires an interest in the property evidenced by a certificate of purchase, which can be exchanged for a tax deed after the statutory redemption period expires. If a property does not sell to an individual bidder at the auction, the certificate is transferred to the State of Alabama, and the property can then be purchased directly from the state's inventory of tax-delinquent land.",
      "The Sale of Lien is a more modern Tax Lien system that an increasing number of counties are adopting. In this system, the county sells a lien against the property rather than the property itself. The auction is a \"bid-down\" process where the lien is awarded to the investor who bids the lowest interest rate they are willing to accept on the redemption amount. The bidding starts at a maximum rate of",
      "12% per annum and descends to 0%. If the property owner does not redeem the lien, the lienholder may initiate a foreclosure action to acquire title to the property three years after the sale.",
      "The legislative shift allowing for tax lien sales represents a significant development in Alabama's property tax landscape. The traditional redeemable deed system can be cumbersome for investors, often involving complex post-deed legal actions to secure clear and marketable title. In contrast, tax lien systems are generally perceived as more straightforward for investors whose primary goal is to earn a return through interest payments, with property acquisition being a secondary outcome. The fact that Alabama counties can choose their system creates a fragmented market. This requires investors to conduct due diligence on a county-by-county basis, as the investment vehicle (deed vs. lien), bidding strategy (highest premium vs. lowest interest rate), and potential outcomes are fundamentally different depending on the county's election.",
    ],
    resources: [
      { label: "Alabama Department of Revenue - Property Tax Division", url: "https://www.revenue.alabama.gov/property-tax/" },
      { label: "Alabama Department of Revenue - Tax Delinquent Property Search", url: "https://www.revenue.alabama.gov/property-tax/tax-delinquent-property-and-land-sales/" },
      { label: "Code of Alabama (Official Legislature Website)", url: "https://www.legislature.state.al.us/alison/codeofalabama/1975/coatoc.htm" },
    ],
  },
  AK: {
    classification: "Tax Deed",
    governingStatutes: "Alaska Statutes (AS) Title 29, Chapter 45",
    redemptionPeriod: "There is no post-sale redemption period in Alaska. The pivotal window is the former owner's pre-sale repurchase right, which is extinguished the moment the property is sold at the public auction.",
    interestRate: "The concept of a redemption interest rate paid to a third-party purchaser does not apply in this system. The amount a former owner must pay to the municipality to exercise their repurchase right is stipulated by statute. It includes the full amount from the foreclosure judgment, plus interest at a rate not to exceed 15% per year, any delinquent taxes that would have accrued had the property remained in private ownership, and all costs of foreclosure and maintenance incurred by the municipality.",
    overview: [
      "Alaska's system for collecting delinquent property taxes is a Tax Deed system administered at the municipal level by boroughs and cities. When property taxes become delinquent, the municipality initiates a judicial foreclosure process. This process culminates in the court issuing a Clerk's Deed, which transfers legal title of the property to the municipality. Subsequently, the municipality holds a public auction to sell the property it now owns, with the goal of recovering the delinquent taxes and associated costs. Properties are sold to the highest bidder on an \"AS IS - WHERE IS\" basis, and the successful purchaser receives a deed from the municipality.",
      "A unique and critical feature of Alaska's system is the former owner's \"right of repurchase.\" This is distinct from a typical post-sale redemption period. In Alaska, the former record owner has the right to repurchase the property directly from the municipality at any point after the foreclosure but before the property is sold at the public auction. This dynamic creates a significant variable for potential investors. A property that an investor has spent considerable time and resources researching can be removed from an auction list at the last minute if the former owner exercises this right. This repurchase right can extend for up to 10 years if the property remains unsold by the municipality, creating a long-tail risk for properties acquired \"over-the-counter\" from a municipality's inventory. Therefore, an investor's claim to a property is not secure until the public auction is finalized and the deed is transferred.",
    ],
    resources: [
      { label: "Alaska Statutes", url: "https://www.akleg.gov/basis/statutes.asp" },
      { label: "AS Title 29, Chapter 45 (Property Taxes)", url: "https://www.akleg.gov/basis/statutes.asp#29.45" },
    ],
  },
  AZ: {
    classification: "Tax Lien",
    governingStatutes: "Arizona Revised Statutes (A.R.S.) Title 42, Chapter 18",
    redemptionPeriod: "The property owner has a 3-year redemption period beginning on the date of the tax lien sale to the private investor. The lien must be redeemed in full before the purchaser initiates a foreclosure action.",
    interestRate: "The interest rate is determined by the \"bid-down\" auction process. The statutory maximum rate is 16% per annum, and the winning bidder is the one who accepts the lowest rate. The interest paid upon redemption is calculated at this winning bid rate.",
    overview: [
      "Arizona is a tax lien state where county treasurers conduct annual auctions to sell tax lien certificates on properties with delinquent taxes. The auction is a \"bid-down\" interest rate competition. The lien is awarded to the investor who agrees to accept the lowest rate of interest on the delinquent amount, with bidding starting at a statutory maximum of",
      "16% per annum and descending in increments to 0%. The winning bidder pays the total delinquent taxes, interest, penalties, and fees and receives a Certificate of Purchase (CP), which represents a priority lien on the property.",
      "If the property owner fails to redeem the lien by paying the CP holder the owed amount plus the bid-upon interest within the statutory timeframe, the CP holder can then initiate a judicial foreclosure lawsuit to obtain a Treasurer's Deed and acquire ownership of the property.",
      "Arizona also employs a secondary system for properties that do not sell at the primary tax lien auction. These unsold liens are \"deeded to the State,\" and after the redemption period expires with the state as the holder, the county may conduct a Tax Deed Sale on behalf of the state. This process is distinct from the lien sale; it is an auction of the property itself, not a lien. These sales represent a different risk profile, as the properties have already been passed over by investors at the lien auction, suggesting they may have significant defects. The county offers these properties \"AS IS\" via a quit claim deed with no warranty of title.",
      "This two-tiered structure creates two separate entry points for investors. The primary annual tax lien auction is a competitive market driven by potential interest rate returns, where the main risk is the cost of foreclosure if the lien is not redeemed. The secondary tax deed sale is a high-risk, speculative real estate acquisition strategy, where the primary risk lies in the inherent quality and potential liabilities of the asset itself.",
    ],
    resources: [
      { label: "Arizona Department of Revenue (ADOR)", url: "https://azdor.gov/" },
      { label: "Arizona Revised Statutes (A.R.S.) Title 42", url: "https://www.azleg.gov/arsDetail/?title=42" },
    ],
  },
  AR: {
    classification: "Tax Deed",
    governingStatutes: "Arkansas Code Title 26, Chapter 37",
    redemptionPeriod: "The primary redemption opportunity in Arkansas occurs before the tax sale. The property owner has the right to redeem the property by paying all delinquent taxes, penalties, interest, and costs at any time before 4:00 p.m. on the date of the sale. A limited post-sale redemption period of 30 calendar days from the auction date is also available, during which the owner can redeem the property from the CSL. After this 30-day window, the sale is final, and the former owner's only recourse is to challenge the validity of the sale itself through legal action.",
    interestRate: "This is not an interest-earning investment for a third-party purchaser in the typical sense. The owner redeems by paying the full amount owed directly to the state, which includes all taxes, penalties, interest, and fees that have accrued.",
    overview: [
      "Arkansas operates a centralized Tax Deed system managed by the Commissioner of State Lands (CSL). When real property taxes have been delinquent for approximately four to five years, the county certifies the property to the CSL. The CSL is then responsible for collecting the delinquent taxes or, failing that, selling the property at a public auction. These auctions are held annually for each county, often grouped into regional sales events.",
      "The successful bidder at the auction purchases the property itself and receives a Limited Warranty Deed from the CSL. Properties that do not receive a bid at the initial public auction are made available for purchase through ongoing Post-Auction Sales, which may involve negotiated prices after a certain period.",
      "A critical consideration for investors in Arkansas is that the Limited Warranty Deed issued by the CSL does not convey marketable title. Marketable title is essential for obtaining title insurance or securing financing for the property. Under Arkansas law, one way to achieve marketable title is to hold the property and pay taxes on it for 15 years, a timeframe that is not practical for most investors. The standard and necessary procedure is to file a",
      "Quiet Title Lawsuit. This is a judicial action where all parties with a potential interest in the property are notified and given a chance to state their claim before a court. The court then issues a decree that confirms full ownership, which serves as marketable title. This process introduces significant, non-negotiable post-auction costs and time delays, typically averaging around six months and costing over $1,000 in legal fees and expenses per parcel. Therefore, the true acquisition cost of an Arkansas tax sale property is the winning bid plus the subsequent costs of the quiet title action.",
    ],
    resources: [
      { label: "Arkansas Commissioner of State Lands (CSL)", url: "https://www.cosl.org/" },
      { label: "CSL Public Auction Information", url: "https://www.cosl.org/real-estate-services/tax-delinquent-property-auctions/" },
      { label: "Arkansas Code (Official Legislature Website)", url: "https://www.arkleg.state.ar.us/Code/" },
    ],
  },
  CA: {
    classification: "Tax Deed",
    governingStatutes: "California Revenue and Taxation Code, Division 1, Part 6, Chapter 7 (§ 3691 et seq.)",
    redemptionPeriod: "All rights of redemption expire at 5:00 p.m. on the last business day prior to the date of the tax sale. There is no right of redemption after the sale has occurred.",
    interestRate: "Not applicable in the context of a post-sale redemption. The amount required to redeem the property before the sale includes all delinquent taxes, costs, and statutory penalties accrued up to the point of payment.",
    overview: [
      "California operates a pure Tax Deed system. After a property's taxes have been delinquent for five years (or three years for nonresidential commercial property), the county tax collector is empowered to sell the property at a public auction to recover the unpaid taxes. These auctions, which can be conducted either in-person or online, sell the property itself to the highest bidder. The minimum bid is set at the total amount required to redeem the property, which includes all delinquent taxes, penalties, fees, and costs associated with the sale. The successful bidder receives a tax deed, which conveys title to the property free and clear of most pre-existing liens and encumbrances.",
      "The most defining feature of the California system is the absolute finality of the sale. State law is unequivocal that the property owner's right to redeem the property is terminated at 5:00 p.m. on the last business day before the auction begins. There is no post-sale redemption period in California. This provides a high degree of certainty for auction purchasers. Once the sale is finalized and the tax deed is recorded, the former owner's rights are extinguished, and their only recourse is to challenge the procedural validity of the sale in court.",
      "This lack of a redemption period makes California a direct and potent market for property acquisition via tax sales. It eliminates the risk of a former owner redeeming the property post-auction, a common variable in lien and redeemable deed states. However, this finality also elevates the importance of pre-sale due diligence. Since the purchase is final and properties are sold \"AS IS\" and \"buyer beware,\" investors must conduct thorough research into a property's location, condition, zoning, and potential encumbrances that may survive the sale, as there is no opportunity to reverse the transaction through redemption.",
    ],
    resources: [
      { label: "California State Controller's Office - Property Tax Information", url: "https://www.sco.ca.gov/ardtax_property_tax.html" },
      { label: "California Revenue & Taxation Code", url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml" },
    ],
  },
  CO: {
    classification: "Hybrid",
    governingStatutes: "Colorado Revised Statutes (C.R.S.) Title 39, Articles 11 & 12",
    redemptionPeriod: "The property owner has a 3-year redemption period from the date of the initial tax lien sale. The property can be redeemed at any time during this period by paying the county treasurer the required amount.",
    interestRate: "The interest rate is statutorily set at nine percentage points above the federal discount rate as of September 1 of the sale year. For the 2024 tax lien sales, this rate is 15% per annum. This rate is fixed for the life of the certificate and applies to the face value of the certificate, not the premium paid.",
    overview: [
      "Colorado operates a Tax Lien system with unique procedural complexities. Annually, county treasurers hold a public auction to sell tax liens on properties with delinquent taxes. The auction is conducted on a",
      "premium bid basis. Investors bid amounts in excess of the total taxes, interest, and costs due. The tax lien certificate is awarded to the bidder who pays the highest premium. This premium is a non-refundable cost of acquiring the lien and does not earn interest for the investor. The investor's potential return comes solely from the statutory interest that accrues on the face amount of the certificate (the delinquent tax portion).",
      "If the property owner does not redeem the lien within a three-year period, the process becomes more complex. The certificate holder does not automatically get the property. Instead, they must apply to the treasurer for a Treasurer's Deed. This application triggers a second public auction for a \"Certificate of Option for a Treasurer's Deed\". At this second sale, the original lienholder can be outbid. This two-auction structure fundamentally shapes the investment landscape in Colorado.",
      "The system's design, particularly the non-refundable premium and the uncertainty of acquiring the property through the second auction, suggests that the primary incentive for many investors is the high statutory interest rate rather than property acquisition. As noted by Jefferson County officials, tax sales are popular because the interest rates are attractive compared to other investments, and it is rare for high-value properties to be lost to a tax deed. This positions Colorado primarily as an interest-rate investment state, where the path to property acquisition is less direct and more competitive than in other jurisdictions.",
    ],
    resources: [
      { label: "Colorado Department of Revenue - Taxation Division", url: "https://tax.colorado.gov/" },
      { label: "Colorado Revised Statutes", url: "https://leg.colorado.gov/laws" },
    ],
  },
  CT: {
    classification: "Hybrid (Redeemable Deed / Lien Assignment / Judicial Foreclosure)",
    governingStatutes: "Connecticut General Statutes (CGS) Title 12, Chapter 204",
    redemptionPeriod: "Standard (Tax Sale): The owner has 6 months from the date of the tax sale to redeem the property. Reduced (Tax Sale): For properties deemed abandoned or meeting other specific criteria, the redemption period is shortened to 60 days. Judicial Foreclosure/Lien Assignment: The redemption period is set by the court as part of the foreclosure judgment.",
    interestRate: "When a property is redeemed after a tax sale, the redeeming party must pay the purchaser the full purchase price plus interest at a rate of 18% per annum (calculated at 1.5% per month).",
    overview: [
      "Connecticut provides its municipalities with a flexible toolkit for collecting delinquent property taxes, resulting in a hybrid system. The three primary methods are:",
      "Tax Sale (Redeemable Deed): Municipalities can conduct a public auction, selling the property to the highest bidder. This functions as a redeemable deed sale. The collector executes a deed to the purchaser, but the deed is held in escrow by the town clerk during a statutory redemption period. If the owner redeems, the sale is voided; if not, the deed is delivered to the purchaser, conveying title.",
      "Judicial Tax Foreclosure: As an alternative to a tax sale, a municipality may file a lawsuit in court to foreclose its tax lien. The court oversees the process and sets the time limit for redemption.",
      "Tax Lien Assignment: Some municipalities, such as East Hartford, choose to sell and assign their tax liens to private investors, often through a Request for Proposal (RFP) process. In this scenario, the investor purchases the lien itself, not the property. The investor then gains the rights of the municipality to collect the debt or to initiate their own foreclosure action to obtain title, bearing all associated legal costs.",
      "This trifurcated system means that there is no single, statewide process for tax sales. The investment strategy, risk profile, and timeline differ dramatically depending on the method chosen by a specific town or city. A redeemable deed sale is an auction-based acquisition play where the main risk is redemption. In contrast, a tax lien assignment is a pure lien investment where the path to ownership requires a separate, investor-funded foreclosure lawsuit. This fragmentation requires investors to perform due diligence not just on properties, but on the specific procedures of each municipality.",
    ],
    resources: [
      { label: "Connecticut Department of Revenue Services", url: "https://portal.ct.gov/drs" },
      { label: "Connecticut General Statutes", url: "https://www.cga.ct.gov/current/pub/titles.htm" },
    ],
  },
  DE: {
    classification: "Redeemable Deed",
    governingStatutes: "Delaware Code",
    redemptionPeriod: "The property owner has a right to redeem the property for approximately 90 days after the Sheriff's Sale. This right is extinguished once the sale is formally confirmed by the Superior Court.",
    interestRate: "If the property is redeemed, the purchaser is reimbursed their full bid amount plus a 15% premium on that amount.",
    overview: [
      "Delaware utilizes a Redeemable Deed system for collecting delinquent property taxes. The process is managed at the county level and executed by the County Sheriff's Office through a public auction, commonly referred to as a \"Monition Sale\". At this sale, the property itself is sold to the highest verbal bidder. For tax sales, the winning bidder is typically required to pay the full bid amount on the day of the sale.",
      "After the sale, the successful bidder receives an equitable interest in the property, but the former owner retains a statutory right of redemption for a limited period. The sale must be confirmed by the Superior Court, and the redemption period runs until this confirmation, which is approximately 90 days post-auction.",
      "The most compelling feature of Delaware's system for investors is the structure of the redemption payment. If the former owner redeems the property, the auction purchaser is entitled to receive their full bid amount back, plus a substantial, flat-rate premium. In Kent County, for example, this premium is 15% of the bid amount. This is a significant departure from states that use a per-annum interest rate, where a quick redemption results in a minimal return. In Delaware, the flat premium provides a high, guaranteed return on capital regardless of how quickly the redemption occurs. This structure creates a favorable scenario for investors, as they are positioned to either acquire the property if it is not redeemed or achieve a significant return on their investment if it is.",
    ],
    resources: [
      { label: "Delaware Code Online", url: "https://delcode.delaware.gov/" },
      { label: "State of Delaware Official Website", url: "https://delaware.gov/" },
    ],
  },
  FL: {
    classification: "Hybrid (Tax Lien followed by Tax Deed)",
    governingStatutes: "Florida Statutes (F.S.) Chapter 197",
    redemptionPeriod: "Tax Lien Certificate: The certificate can be redeemed by the property owner at any time within 2 years from April 1 of the year the certificate was issued. Tax Deed Sale: The right of redemption continues after a deed application is filed but is permanently extinguished upon the receipt of full payment from the winning bidder at the tax deed auction. There is no redemption period after the deed sale is finalized.",
    interestRate: "Tax Lien Certificate: The rate is determined by the competitive bid-down auction, with a maximum of 18% per annum. Post-Deed Application: If the property is redeemed after a tax deed application has been filed, interest accrues at a fixed rate of 1.5% per month on the full application amount, starting from the month after the application date.",
    overview: [
      "Florida employs a sophisticated two-step hybrid system that begins with the sale of a tax lien and can culminate in the sale of a tax deed. This structure creates two distinct opportunities for investors with different strategies and risk tolerances.",
      "Step 1: Tax Certificate Sale (Lien Sale): Annually, typically in late spring, county tax collectors hold an auction for tax lien certificates on properties with delinquent taxes. This is a \"bid-down\" interest rate auction where the certificate is awarded to the investor who will accept the lowest interest rate on the debt. Bidding starts at a statutory maximum of",
      "18% per annum and descends to 0%. The winning bidder receives a tax certificate, which is a priority lien, but does not convey any ownership rights. This part of the system is designed for investors seeking a passive, secured return on their capital through interest payments upon redemption.",
      "Step 2: Tax Deed Sale (Property Auction): If a tax certificate is not redeemed within two years from April 1 of its issuance year, the certificate holder can initiate the second phase by submitting a tax deed application to the tax collector. This application requires the certificate holder to pay all other outstanding taxes and fees on the property. The application triggers a public auction of the",
      "property itself. The opening bid is set at the total amount of all taxes, fees, and interest paid by the applicant. The property is sold to the highest bidder for cash. If the original certificate holder is outbid, they are reimbursed their entire investment plus interest from the sale proceeds. Any funds paid above the opening bid constitute a surplus, which is available to the former owner and other recorded lienholders. This sale is the direct path for investors seeking to acquire property.",
      "This lien-to-deed funnel effectively separates the market. The certificate sale attracts investors focused on interest returns, while the deed sale attracts those focused on real estate acquisition.",
    ],
    resources: [
      { label: "Florida Department of Revenue - Property Tax", url: "https://floridarevenue.com/property/" },
      { label: "Florida Statutes Online", url: "http://www.leg.state.fl.us/statutes/" },
    ],
  },
  GA: {
    classification: "Redeemable Deed",
    governingStatutes: "Official Code of Georgia Annotated (O.C.G.A.) Title 48, Chapter 4",
    redemptionPeriod: "The statutory redemption period is 12 months from the date of the tax sale. After this 12-month period, the tax sale purchaser can initiate legal proceedings to foreclose, or \"bar,\" the right of redemption.",
    interestRate: "The redemption amount is calculated based on a premium structure, not a traditional interest rate. To redeem, the owner must pay the purchaser: The full bid amount from the tax sale. A 20% premium on the bid amount if redeemed at any point within the first year (or fraction of a year). A 10% premium for each additional year or fraction of a year thereafter. The cost of any subsequent taxes paid by the purchaser.",
    overview: [
      "Georgia employs a Redeemable Deed system for the collection of delinquent property taxes. The process begins when a county Tax Commissioner issues a tax execution, known as a fieri facias (Fi. Fa.), against a delinquent property. This execution directs the County Sheriff to levy the property and sell it at a public auction to satisfy the tax debt. These Sheriff's Tax Sales are typically held on the first Tuesday of each month on the steps of the county courthouse.",
      "The property is sold to the highest bidder, who then receives a Sheriff's Tax Deed. This deed is not immediately absolute. The property owner, as well as any other party with a recorded interest in the property (such as a mortgage holder), retains a statutory right to redeem the property for a period of time after the sale.",
      "Two features make Georgia's system particularly notable for investors. First is the redemption premium structure. A redeeming party must pay the purchaser the full bid amount plus a substantial, front-loaded premium of 20% if redeemed within the first year. This provides a significant potential return on investment, even for very short holding periods. Second is the concept of \"ripening by prescription.\" If the right of redemption is not exercised by the former owner and the tax deed purchaser does not actively foreclose that right, the purchaser's title can become absolute after they have held the tax deed for four years and met other statutory requirements, such as paying subsequent taxes. This offers a passive, albeit longer, path to securing marketable title, which is an advantage over states that effectively require a quiet title lawsuit to make the property marketable.",
    ],
    resources: [
      { label: "Georgia Department of Revenue", url: "https://dor.georgia.gov/" },
      { label: "Official Code of Georgia Annotated (O.C.G.A.)", url: "https://www.legis.ga.gov/laws/browse/georgia-code" },
    ],
  },
  HI: {
    classification: "Redeemable Deed",
    governingStatutes: "Hawaii Revised Statutes (HRS) § 231-63 et seq.",
    redemptionPeriod: "The property owner has a right of redemption for 1 year following the date of the tax sale. This period can be extended if the purchaser fails to record the tax deed with the Bureau of Conveyances within 60 days of the sale; in that case, the redemption period becomes one year from the date the deed is actually recorded.",
    interestRate: "To redeem the property, the owner must pay the auction purchaser the full purchase price, plus any costs and expenses, and interest at a rate of 12% per year.",
    overview: [
      "Hawaii operates a Redeemable Deed system for the collection of delinquent property taxes, which are administered at the county level. After a tax lien has existed on a property for three years, the county tax collector has the authority to sell the property at a public auction to the highest bidder. This process is considered a \"foreclosure without suit\".",
      "The winning bidder at the auction receives a tax deed, which grants them title to the property. However, this title is subject to the original owner's statutory right of redemption, which extends for a period after the sale. If the owner redeems the property within this timeframe, the tax deed is effectively voided, and the purchaser is reimbursed their investment plus a statutory rate of interest. If the property is not redeemed, the purchaser's title becomes absolute. The process requires extensive notice to the property owner, including mail and public posting, before the sale can occur.",
    ],
    resources: [
      { label: "Hawaii Department of Taxation", url: "https://tax.hawaii.gov/" },
      { label: "Hawaii Revised Statutes", url: "https://www.capitol.hawaii.gov/hrscurrent/" },
    ],
  },
  ID: {
    classification: "Tax Deed",
    governingStatutes: "Idaho Code Title 63, Chapter 10 and Title 31, Chapter 8",
    redemptionPeriod: "The right of redemption exists until the property is sold at the county's public auction. There is no post-sale redemption period for the former owner.",
    interestRate: "Not applicable to a third-party purchaser, as redemption occurs with the county prior to the auction. The owner must pay all delinquent taxes, late charges, and interest to the county to redeem the property.",
    overview: [
      "Idaho is a strict Tax Deed state. The state explicitly does not sell tax lien certificates to investors. When property taxes become delinquent, a perpetual lien is placed on the property in favor of the county. If taxes remain delinquent for three years, the county initiates a \"Tax Deed Process\". This is a legal process where the county takes title to the property, extinguishing the rights of the former owner.",
      "Once the county has acquired the property via tax deed, the Board of County Commissioners is required to offer the property for sale at a public auction to the highest bidder. These auctions are typically held annually, often in January. The winning bidder at the auction receives a quitclaim deed from the county, transferring the county's interest in the property.",
      "The redemption process in Idaho is entirely a pre-auction affair. The former owner and other parties of interest can redeem the property at any point during the three-year delinquency period and throughout the tax deed process, up until the moment the property is sold at the public auction. Once the auction sale is complete, the former owner's rights are terminated, and there is no post-sale redemption period for them. The law does allow for a one-year period after the sale during which the tax deed process itself can be challenged in court if it is proven to have been irregular.",
    ],
    resources: [
      { label: "Idaho State Tax Commission", url: "https://tax.idaho.gov/" },
      { label: "Idaho Statutes", url: "https://legislature.idaho.gov/statutesrules/idstat/" },
    ],
  },
  IL: {
    classification: "Tax Lien",
    governingStatutes: "Illinois Compiled Statutes (ILCS) Chapter 35, Act 200, Article 21",
    redemptionPeriod: "The redemption period in Illinois varies: Standard Properties: 2. years (30 months) from the date of the sale. Residential (1-6 units) & some Commercial: 2 years (24 months) from the date of the sale. Vacant Non-Farm & some Commercial: Can be shortened to 6 months.",
    interestRate: "The rate is a penalty, not per-annum interest, and is determined by the bid-down auction. Annual Sale: The winning bid percentage (from 0% to 18%) is applied to the tax amount for each 6-month period or fraction thereof that passes before redemption. For example, a winning bid of 9% would result in a 9% penalty if redeemed within 6 months, an 18% penalty if redeemed between 6 and 12 months, and so on. Scavenger Sale: The penalty is statutorily fixed and more severe. For example, it is 12% of the tax amount if redeemed between 2 and 6 months, and 24% if redeemed between 6 and 12 months.",
    overview: [
      "Illinois is a Tax Lien state with a multifaceted system that includes several types of sales. The primary method is the Annual Tax Sale, where county collectors sell liens on properties with delinquent taxes from the previous year. This sale is a \"bid-down\" penalty auction. Bidders compete by bidding down the penalty percentage they are willing to accept upon redemption, starting at a maximum of",
      "18% and descending to 0%. The penalty is applied every six months. The lien is sold to the bidder who accepts the lowest penalty rate.",
      "In addition to the Annual Sale, Illinois has two other notable sale types:",
      "Forfeiture Sale: When a property's delinquent taxes are offered at the Annual Sale but receive no bids, the taxes are \"forfeited\" to the state. These forfeited tax liens can then be purchased \"over the counter\" directly from the county clerk.",
      "Scavenger Sale: Held in odd-numbered years, this sale includes properties with taxes that have been delinquent for three or more years (two or more in Cook County). At a Scavenger Sale, bidders are not required to pay the full amount of back taxes; they can bid a lesser amount, and the property is sold to the highest bidder. This sale is designed to get chronically delinquent properties back on the tax rolls.",
      "After any of these sales, the purchaser receives a tax certificate. If the property owner does not redeem the property within the statutory period, the tax purchaser must petition the court to obtain a tax deed.",
    ],
    resources: [
      { label: "Illinois Department of Revenue", url: "https://tax.illinois.gov/" },
      { label: "Illinois Compiled Statutes (ILCS)", url: "https://www.ilga.gov/legislation/ilcs/ilcs.asp" },
    ],
  },
  IN: {
    classification: "Tax Lien",
    governingStatutes: "Indiana Code (IC) Title 6, Article 1.1, Chapters 24 & 25",
    redemptionPeriod: "Treasurer's Sale: 1 year from the date of the sale. Commissioner's Sale: 120 days from the date of the sale.",
    interestRate: "The redemption amount is calculated using a penalty and interest structure: Penalty on Minimum Bid: If redeemed within 6 months of the sale: 10% of the minimum bid amount. If redeemed after 6 months but within 1 year: 15% of the minimum bid amount. Interest on Overbid/Surplus: The purchaser also receives 5% per annum interest on the overbid amount. The redeeming party must also reimburse the purchaser for attorney's fees and other costs associated with the legally required notifications.",
    overview: [
      "Indiana is a Tax Lien state with a system that includes two primary types of sales: the Treasurer's Tax Sale and the Commissioner's Sale.",
      "The Treasurer's Tax Sale is the main annual auction where counties sell tax liens on properties with delinquent taxes. The auction is a competitive bidding process where the starting bid is the total amount of delinquent taxes, costs, and fees. The lien is awarded to the highest bidder. The amount paid above the minimum bid is known as \"overbid\" or \"surplus,\" which does not earn the higher penalty rate but does earn a lower rate of interest. The purchaser receives a tax sale certificate, which represents a lien on the property, not ownership.",
      "If a property is offered at a Treasurer's Sale and does not receive a bid, the county commissioners acquire the lien. The commissioners can then offer these properties at a subsequent Commissioner's Sale. These sales are often more attractive to investors because the minimum bid may be significantly lower than the total taxes owed, and the redemption period is much shorter.",
      "If the property owner does not redeem the lien within the statutory period, the tax sale purchaser must follow a strict notice process and then petition the local court for a tax deed to acquire the property.",
    ],
    resources: [
      { label: "Indiana Department of Local Government Finance", url: "https://www.in.gov/dlgf/" },
      { label: "Indiana Code", url: "http://iga.in.gov/legislative/laws/2022/ic/" },
    ],
  },
  IA: {
    classification: "Tax Lien",
    governingStatutes: "Iowa Code Chapter 446",
    redemptionPeriod: "The process to acquire a deed cannot begin until a specific waiting period has passed from the date of the sale: Regular Certificate: 1 year and 9 months. Public Bidder (PB) Certificate: 9 months. Once the certificate holder initiates the deed process by serving a 90-day notice, the owner has that 90-day window to redeem before their rights are extinguished.",
    interestRate: "The interest paid upon redemption is 2% per month (non-compounding), calculated on the certificate amount from the date of the sale. This equates to a 24% annual rate.",
    overview: [
      "Iowa is a Tax Lien state. Each year on the third Monday in June, county treasurers hold a public auction to sell tax certificates on properties with delinquent taxes. The sale is for the total amount of taxes, interest, fees, and costs due.",
      "The auction is a \"bid-down\" process, but instead of bidding on an interest rate, bidders compete on the percentage of ownership they are willing to accept for paying the delinquent amount. Bidding starts at 100% undivided interest and is bid down in whole percentage points to 1%. The tax certificate is awarded to the bidder who agrees to accept the smallest percentage of the property in exchange for paying the taxes. If multiple bidders offer the same lowest percentage, the winner is chosen randomly.",
      "The purchaser of the tax certificate holds a lien on the property. If the property owner redeems, the certificate holder receives their investment back plus a statutory monthly interest. If the property is not redeemed within the statutory period, the certificate holder can initiate a 90-day process to take deed to the property.",
      "A special category exists for properties that do not sell at the first tax sale. They may be offered again at a subsequent sale as a \"public bidder\" or \"PB\" certificate. These PB certificates have a shorter waiting period before the holder can begin the process of taking the deed.",
    ],
    resources: [
      { label: "Iowa Department of Revenue", url: "https://tax.iowa.gov/" },
      { label: "Iowa Code", url: "https://www.legis.iowa.gov/law/iowaCode" },
    ],
  },
  KS: {
    classification: "Tax Deed",
    governingStatutes: "Kansas Statutes Annotated (K.S.A.) Chapter 79, Article 28",
    redemptionPeriod: "The right of redemption expires at 5:00 p.m. on the day before the tax foreclosure auction. There is no post-sale redemption right for the former owner.",
    interestRate: "Not applicable to a third-party purchaser, as redemption is made with the county prior to the sale. The owner must pay all delinquent taxes plus accrued interest and costs to the county to redeem the property. The specific statutory interest rate is not detailed in the provided materials.",
    overview: [
      "Kansas is a Tax Deed state. When real estate taxes are delinquent for a specified period (typically three years for most properties), the county can initiate a judicial tax foreclosure action. This is a lawsuit filed in court to obtain a judgment against the property for the unpaid taxes.",
      "Once the court grants a judgment, the property is scheduled for a Sheriff's Sale, which is a public auction conducted by the County Sheriff. The property is sold to the highest bidder. The sale must be confirmed by the court, after which the sheriff issues a deed to the purchaser, conveying ownership of the property.",
      "The defining characteristic of the Kansas system is that the redemption period occurs entirely before the auction. The property owner has the right to redeem the property by paying all delinquent taxes, interest, and costs at any point up until the close of business on the day before the scheduled auction. There is no post-sale redemption period for the former owner, with the exception of a potential federal redemption period if an IRS lien exists on the property. This provides finality for the winning bidder once the sale is confirmed by the court.",
    ],
    resources: [
      { label: "Kansas Department of Revenue", url: "https://www.ksrevenue.gov/" },
      { label: "Kansas Statutes Annotated", url: "http://www.ksrevisor.org/statutes.html" },
    ],
  },
  KY: {
    classification: "Tax Lien",
    governingStatutes: "Kentucky Revised Statutes (KRS) Chapter 134",
    redemptionPeriod: "The property owner has 1 year from the date the certificate of delinquency is sold to a third party to redeem the property. If the lien is not redeemed within this period, the purchaser can begin foreclosure proceedings.",
    interestRate: "The redemption amount includes the original certificate amount plus accrued interest and fees. The specific interest rate is 12% per annum (1% per month) on the certificate amount. Additional administrative fees and attorney's fees incurred in preparing for foreclosure can also be added to the redemption total.",
    overview: [
      "Kentucky is a Tax Lien state. When property taxes become delinquent, a \"certificate of delinquency\" is created, which constitutes a lien against the property. These certificates are then sold to third-party purchasers by the county clerk. The sale process can vary by county; for example, Jefferson County uses a lottery system to determine the order of purchase, while other counties may use a more traditional auction format.",
      "The third-party purchaser buys the lien, not the property itself. The purchaser's investment earns interest and penalties. If the property owner does not redeem the certificate of delinquency within the statutory timeframe, the lienholder can initiate a judicial foreclosure action to enforce the lien and acquire the property. Purchasers must register with both the Kentucky Department of Revenue and the local county clerk's office to participate in the sales.",
    ],
    resources: [
      { label: "Kentucky Department of Revenue", url: "https://revenue.ky.gov/" },
      { label: "Kentucky Revised Statutes", url: "https://apps.legislature.ky.gov/law/statutes/" },
    ],
  },
  LA: {
    classification: "Redeemable Deed",
    governingStatutes: "Louisiana Revised Statutes (LRS) Title 47",
    redemptionPeriod: "The standard redemption period is 3 years from the date the tax sale certificate is recorded in the parish conveyance records. This period can be shortened to 18 months for certain blighted properties.",
    interestRate: "To redeem the property, the owner must pay the tax collector, for the benefit of the purchaser, the following amounts: The price paid by the purchaser at the tax sale. A 5% penalty on the purchase price. Interest at a rate of 1% per month (or fraction thereof) from the date of the sale until redemption.",
    overview: [
      "Louisiana operates a Redeemable Deed system, though it is often referred to as a \"tax sale.\" When property taxes become delinquent, the parish (county) tax collector will advertise and sell the property at a public auction to collect the unpaid taxes. The property is sold to the highest bidder, who pays the delinquent amount plus any premium and receives a tax sale certificate. This certificate represents an ownership interest in the property, subject to the former owner's right of redemption.",
      "If no bids are received at the tax sale, the property is \"adjudicated\" to the parish, meaning the local government becomes the holder of the tax sale title. These adjudicated properties can later be sold by the parish.",
      "The key feature of the Louisiana system is the lengthy post-sale redemption period. If the former owner redeems the property, they must pay the tax sale purchaser the full bid amount plus a penalty and monthly interest. If the property is not redeemed by the end of the statutory period, the tax sale purchaser must file a",
      "Quiet Title suit in court to perfect their ownership and remove any other claims or clouds on the title, making their deed absolute and marketable.",
    ],
    resources: [
      { label: "Louisiana Department of Revenue", url: "https://revenue.louisiana.gov/" },
      { label: "Louisiana State Legislature (Statutes)", url: "https://www.legis.la.gov/" },
      { label: "Louisiana Law Help (Tax Sale Info)", url: "https://louisianalawhelp.org/resource/tax-sales" },
    ],
  },
  ME: {
    classification: "Tax Deed",
    governingStatutes: "Maine Revised Statutes (MRS) Title 36",
    redemptionPeriod: "The redemption period occurs before the municipality's foreclosure is complete. The length of this period can vary but is typically 18 months after the tax lien is filed. There is no post-sale redemption period after the property is sold by the municipality.",
    interestRate: "Not applicable to a third-party purchaser, as redemption is made with the municipality prior to the property being offered for sale. The owner must pay the municipality all delinquent taxes, accrued interest, and costs to redeem the property and prevent foreclosure.",
    overview: [
      "Maine is a Tax Deed state where the collection of delinquent property taxes is highly decentralized and managed at the municipal (town or city) level. The process typically involves the municipality perfecting a tax lien and then foreclosing on that lien, which transfers ownership of the property to the municipality.",
      "Once the municipality acquires title to a tax-delinquent property, it can sell the property to recover the unpaid taxes and costs. Recent legislative changes have altered the sale process. Previously, municipalities and the state (for properties in unorganized territories) often used sealed bid processes. Now, the trend is toward listing these tax-acquired properties for sale with licensed real estate agents or brokers, similar to a standard real estate transaction.",
      "The redemption period for the property owner expires before the municipality takes full ownership. Once the foreclosure process is complete and the municipality holds the deed, the former owner's rights are extinguished. There is no post-sale redemption period for a purchaser who buys the property from the municipality.",
    ],
    resources: [
      { label: "Maine Revenue Services - Property Tax", url: "https://www.maine.gov/revenue/taxes/property-tax" },
      { label: "Maine Revised Statutes", url: "https://www.mainelegislature.org/legis/statutes/" },
    ],
  },
  MD: {
    classification: "Tax Lien",
    governingStatutes: "Annotated Code of Maryland, Tax-Property Article, § 14-801 et seq.",
    redemptionPeriod: "The property owner has the right to redeem at any time until the right of redemption is finally foreclosed by an order of the Circuit Court. The certificate holder may begin foreclosure proceedings 6 months after the date of the tax sale.",
    interestRate: "The interest rate paid upon redemption is set by each individual county and varies widely. Examples include: Montgomery County: 20% per annum 91 Prince George's County: 20% per annum 91 Baltimore City: 18% per annum 91 Baltimore County: 12% per annum 91 Anne Arundel County: 12% per annum 91 Howard County: 18% per annum 91",
    overview: [
      "Maryland is a Tax Lien state. County governments hold annual public auctions to sell tax lien certificates for properties with delinquent taxes. The auction is a",
      "high bid premium auction. The lien is sold for an amount that includes the back taxes, interest, and penalties, plus a premium bid by the investor. The lien certificate is awarded to the bidder who pays the highest premium for the property.",
      "The purchaser of the certificate does not acquire the property, but rather the right to collect the lien amount plus a statutory interest rate upon redemption by the property owner. If the owner fails to redeem the property within the statutory period, the certificate holder must initiate a judicial foreclosure action in the Circuit Court to extinguish the owner's right of redemption and obtain a deed to the property. This foreclosure action cannot be started until at least six months have passed since the tax sale. The certificate is void if foreclosure proceedings are not initiated within two years of the sale date.",
      "A notable feature of Maryland's system is that the redemption interest rates vary significantly by county, ranging from as low as 6% to as high as 20% per annum. This creates diverse investment opportunities across the state and necessitates county-specific due diligence.",
    ],
    resources: [
      { label: "Maryland Department of Assessments and Taxation (SDAT)", url: "https://dat.maryland.gov/" },
      { label: "SDAT Tax Sale Information", url: "https://dat.maryland.gov/pages/tax-sale-information.aspx" },
      { label: "Maryland General Assembly (Statutes)", url: "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText" },
    ],
  },
  MA: {
    classification: "Tax Lien",
    governingStatutes: "Massachusetts General Laws (MGL) Chapter 60",
    redemptionPeriod: "The property owner has the right to redeem the tax title at any time after the sale until the Land Court enters a judgment foreclosing their right of redemption. The lienholder can initiate foreclosure proceedings 6 months after the date of the tax sale.",
    interestRate: "The interest rate is determined by the bid-down auction, starting at a maximum of 16% per annum and descending to 0%. The interest paid upon redemption is calculated at the winning bid rate.",
    overview: [
      "Massachusetts is a Tax Lien state where municipalities (cities and towns) sell tax liens, often referred to as \"tax titles,\" to recover delinquent property taxes. After a property's taxes are delinquent for a specified period, the municipal collector can place a lien on the property and then sell this lien at a public auction.",
      "The auction is a bid-down interest rate auction. The lien is awarded to the bidder who will accept the lowest interest rate on the redemption amount, with bidding starting at a maximum of 16% per annum. The winning bidder pays the delinquent taxes and costs and receives a Collector's Deed, which functions as a tax lien certificate. This instrument does not convey immediate ownership but rather gives the holder a security interest in the property.",
      "If the property owner does not redeem the tax title within the statutory period, the lienholder must file a petition in the Massachusetts Land Court to foreclose the owner's right of redemption. Only after obtaining a foreclosure judgment from the Land Court does the lienholder acquire absolute title to the property.",
    ],
    resources: [
      { label: "Massachusetts Department of Revenue - Division of Local Services", url: "https://www.mass.gov/orgs/division-of-local-services" },
      { label: "Massachusetts General Laws", url: "https://malegislature.gov/Laws/GeneralLaws" },
    ],
  },
  MI: {
    classification: "Tax Deed",
    governingStatutes: "Michigan Compiled Laws (MCL) 211. et seq. (General Property Tax Act)",
    redemptionPeriod: "All redemption rights are extinguished when the Circuit Court enters the judgment of foreclosure, which occurs before the public auction. There is no post-sale redemption period for the former owner.",
    interestRate: "Not applicable, as there is no post-sale redemption. The owner must pay all taxes, fees, and a significantly higher interest rate (1.5% per month) during the forfeiture/foreclosure period to prevent the loss of the property.",
    overview: [
      "Michigan operates a Tax Deed system administered by the county treasurers as \"Foreclosing Governmental Units\" (FGUs). The process is defined by a strict timeline of forfeiture and foreclosure that occurs before any public sale.",
      "When property taxes are delinquent for more than two years, the property enters forfeiture. This is a notification stage, not a loss of ownership. One year after forfeiture (three years of delinquency), the FGU files a judicial foreclosure petition. If a judgment is entered and the taxes remain unpaid, absolute title to the property vests in the FGU, extinguishing all prior ownership and lienholder rights (with some exceptions for certain government liens).",
      "Only after this foreclosure is complete does the FGU offer the property for sale at a public auction. Michigan law mandates a two-stage auction process:",
      "First Auction (Minimum Bid): The property is offered for a minimum bid that includes all delinquent taxes, penalties, interest, and fees.",
      "Second Auction (No Minimum Bid): Any properties not sold at the first auction are re-offered at a second auction with no minimum bid, selling to the highest bidder.",
      "A recent landmark change in Michigan law (in response to Rafaeli v. Oakland County) now requires that any surplus proceeds from the auction (the amount exceeding the taxes and costs owed) must be made available to the former owner, a significant departure from the previous \"winner-take-all\" system.",
    ],
    resources: [
      { label: "Michigan Department of Treasury - Property Tax Forfeiture", url: "https://www.michigan.gov/propertyforeclosures" },
      { label: "Michigan Legislature (Compiled Laws)", url: "http://www.legislature.mi.gov/" },
    ],
  },
  MN: {
    classification: "Tax Deed",
    governingStatutes: "Minnesota Statutes Chapters 279-282",
    redemptionPeriod: "The redemption period is 3 years from the date of the tax judgment sale (when the county \"bids in\" the property for the state). This entire period occurs before the property forfeits to the state and is offered for public sale. There is no post-sale redemption period for the former owner after the public auction.",
    interestRate: "Not applicable to a third-party purchaser. The owner must pay the county all delinquent taxes plus statutory penalties and interest to redeem during the 3-year pre-forfeiture period.",
    overview: [
      "Minnesota uses a Tax Deed system where properties with delinquent taxes are forfeited to the state in trust for the local taxing districts. The process is managed by the county auditor's office.",
      "When taxes become delinquent, the county obtains a court judgment against the property. This judgment begins a 3-year redemption period for the owner. If the owner fails to redeem the property by paying all outstanding taxes, penalties, and fees within this period, title to the property forfeits to the State of Minnesota. At this point, the former owner's rights are extinguished.",
      "After forfeiture, the county is responsible for managing and selling the property. Recent legislative changes in 2024 have significantly altered the sale process to ensure former owners can claim surplus equity. The county must first offer the property for sale at its estimated market value. If it does not sell, it is then offered at a \"minimum bid\" sale, where the opening bid is the sum of all delinquent taxes and costs. If the property sells for more than this minimum bid, the \"surplus\" is deposited with the court for distribution to the former owner and other interested parties. Properties that do not sell at the minimum bid sale may be offered at a final \"credit bid\" sale at a reduced price.",
    ],
    resources: [
      { label: "Minnesota Department of Revenue", url: "https://www.revenue.state.mn.us/" },
      { label: "Minnesota Statutes", url: "https://www.revisor.mn.gov/statutes/" },
    ],
  },
  MS: {
    classification: "Tax Lien",
    governingStatutes: "Mississippi Code Annotated § 27-41-49 et seq.",
    redemptionPeriod: "The property owner has a 2-year redemption period from the date of the tax lien sale.",
    interestRate: "Upon redemption, the lien purchaser receives their investment (the face value of the lien) back, plus interest at a rate of 1.5% per month, calculated from the date of the sale. This equates to an 18% annual rate. The overbid portion of the purchase price is returned to the purchaser without interest.",
    overview: [
      "Mississippi is a Tax Lien state. When property taxes become delinquent, counties and municipalities hold a public auction to sell a tax lien on the property. These sales are typically held on the first Monday in April or the last Monday in August.",
      "The auction is a premium bid auction, where the lien is sold to the highest bidder. Bidders bid up from the face value of the lien (taxes, penalties, interest, and costs). Any amount paid above the face value is considered an \"overbid\" or premium. The purchaser receives a tax lien certificate but does not gain any ownership rights to the property at the time of sale.",
      "The purchaser's investment earns a high rate of monthly interest on the face value of the lien, but not on the overbid amount. If the property owner fails to redeem the lien within the statutory two-year period, the lienholder can begin the process to mature the tax sale and obtain a tax deed, which is typically handled by the Chancery Clerk's office.",
    ],
    resources: [
      { label: "Mississippi Department of Revenue", url: "https://www.dor.ms.gov/" },
      { label: "Mississippi Secretary of State - Tax Forfeited Lands", url: "https://www.sos.ms.gov/tax-forfeited-inventory" },
      { label: "Mississippi Code (via FindLaw)", url: "https://codes.findlaw.com/ms/" },
    ],
  },
  MO: {
    classification: "Redeemable Deed",
    governingStatutes: "Revised Statutes of Missouri (RSMo) Chapter 140",
    redemptionPeriod: "The redemption period varies: First & Second Offering Sales: 1 year from the sale date. Third Offering Sales: 90 days from the sale date. In some charter counties or cities (like St. Louis), the process and redemption periods can differ.",
    interestRate: "To redeem, the owner must pay the purchaser the full bid amount plus interest at 10% per annum. The owner must also reimburse the purchaser for any subsequent taxes paid, plus interest on those subsequent payments at 8% per annum.",
    overview: [
      "Missouri operates a Redeemable Deed system, where properties with three years of delinquent taxes are offered for sale by the county collector at a public auction. The property is sold to the highest bidder. The purchaser receives a Certificate of Purchase at the sale.",
      "The system has a post-sale redemption period that varies significantly depending on the county's classification and when the property is sold. If the property is redeemed, the purchaser is reimbursed their bid amount plus interest and costs. If the property is not redeemed, the purchaser can apply for and receive a Collector's Deed, which conveys ownership. A key feature is that some counties, like Jackson County, have a more judicialized process for certain properties, managed through the circuit court's Delinquent Land Tax division.",
    ],
    resources: [
      { label: "Missouri Department of Revenue", url: "https://dor.mo.gov/" },
      { label: "Missouri Revisor of Statutes", url: "https://revisor.mo.gov/main/Home.aspx" },
    ],
  },
  MT: {
    classification: "Tax Lien (with a subsequent Tax Deed sale)",
    governingStatutes: "Montana Code Annotated (MCA) Title 15, Chapters 16, 17, & 18",
    redemptionPeriod: "The redemption period is 3 years from the date of the tax lien attachment for most properties. This can be shortened to 2 years for properties that are undeveloped lots subject to certain special improvement district assessments. The owner can redeem at any time before the tax deed is issued.",
    interestRate: "When taxes first become delinquent, a 2% penalty is charged. Interest then accrues at a rate of 5/6 of 1% per month (equivalent to 10% per annum) until paid. To redeem, the owner must pay the assignee the full certificate amount plus any subsequent taxes paid by the assignee, along with the accrued interest and penalties.",
    overview: [
      "Montana's system is a multi-step process that begins as a Tax Lien assignment and can conclude with a Tax Deed sale. When taxes become delinquent, the county automatically attaches a tax lien on behalf of the county. The county does not auction these liens in the traditional sense. Instead, a third-party investor, known as an \"assignee,\" can purchase the county's lien by paying the full delinquent amount, including penalties, interest, and costs. To do so, the assignee must first provide mailed notice to the property owner of their intent to purchase the assignment.",
      "The assignee receives a tax lien certificate. If the property owner does not redeem the lien within the statutory period, the assignee can then apply to the county for a tax deed. This application triggers a notice period, after which the county treasurer will issue the tax deed to the assignee, conveying ownership. There is no competitive auction for the deed itself; it is issued directly to the lienholder who completes the process.",
    ],
    resources: [
      { label: "Montana Department of Revenue", url: "https://mtrevenue.gov/" },
      { label: "Montana Code Annotated", url: "https://leg.mt.gov/bills/mca/" },
    ],
  },
  NE: {
    classification: "Tax Lien",
    governingStatutes: "Nebraska Revised Statutes § 77-1801 et seq.",
    redemptionPeriod: "The property owner has a 3-year redemption period from the date of the tax sale. Redemption can occur up until the treasurer's deed is issued or until the final confirmation of a judicial foreclosure sale.",
    interestRate: "The interest rate paid upon redemption is 14% per annum, calculated on the certificate purchase price and any subsequent taxes paid by the investor.",
    overview: [
      "Nebraska is a Tax Lien state. County treasurers hold an annual public auction on the first Monday in March to sell tax certificates on properties with delinquent taxes. The property lien is sold for the amount of the delinquent taxes, interest, and costs to the person who will pay that amount for the lien. If there is competition, it is a premium bid auction where the lien goes to the highest bidder.",
      "The winning bidder receives a Certificate of Purchase, which represents a lien on the property but does not grant immediate ownership. The investor's certificate earns a high statutory interest rate. If the property owner does not redeem the certificate within the three-year redemption period, the investor has two paths to acquire title:",
      "Application for a Tax Deed: The investor can apply to the county treasurer for a treasurer's deed. This is a non-judicial process that, upon completion, grants the investor ownership.",
      "Judicial Foreclosure: The investor can file a lawsuit in court to foreclose the tax lien, similar to a mortgage foreclosure. This process culminates in a sheriff's sale of the property, where the investor can bid to acquire title.",
      "The investor must choose one of these methods and begin the process within nine months after the three-year redemption period expires.",
    ],
    resources: [
      { label: "Nebraska Department of Revenue", url: "https://revenue.nebraska.gov/" },
      { label: "Nebraska Legislature (Statutes)", url: "https://nebraskalegislature.gov/laws/statutes.php" },
    ],
  },
  NV: {
    classification: "Tax Deed",
    governingStatutes: "Nevada Revised Statutes (NRS) Chapter 361",
    redemptionPeriod: "There is no post-sale redemption period in the traditional sense. The former owner's recourse is a 2-year legal challenge period to contest the sale's validity.",
    interestRate: "Not applicable, as there is no post-sale redemption right for the purchaser to receive interest.",
    overview: [
      "Nevada is a Tax Deed state. When property taxes are delinquent for a specified period, the county treasurer is authorized to hold a public auction and sell the property itself to the highest bidder. The winning bidder receives a deed from the county treasurer, which conveys ownership.",
      "A unique aspect of Nevada's system is the post-sale challenge period. While there is no traditional redemption period where the owner can pay a sum to the purchaser to reclaim the property, there is a two-year period after the sale during which the former owner may file a lawsuit to challenge the validity of the tax sale. This creates a cloud on the title, and as a result, obtaining title insurance on a property purchased at a Nevada tax sale is often not possible until this two-year period has expired. This makes the investment less liquid and riskier in the short term compared to pure tax deed states with no such post-sale period.",
      "Nevada counties may also sell Certificates of Sale for delinquent special assessments, which function like tax liens and are distinct from the sale of property for delinquent real property taxes.",
    ],
    resources: [
      { label: "Nevada Department of Taxation", url: "https://tax.nv.gov/" },
      { label: "Nevada State Legislature (Statutes)", url: "https://www.leg.state.nv.us/nrs/" },
    ],
  },
  NH: {
    classification: "Tax Deed",
    governingStatutes: "New Hampshire Revised Statutes Annotated (RSA) Chapter 80",
    redemptionPeriod: "The redemption period is 2 years from the execution of the tax lien by the municipality. This period occurs before the property is deeded to the municipality and subsequently sold to the public. There is no post-sale redemption period for the former owner.",
    interestRate: "Not applicable to a third-party purchaser. To redeem from the municipality, the owner must pay all back taxes, costs, and accrued interest at a rate set by statute.",
    overview: [
      "New Hampshire is a Tax Deed state where the tax collection process is managed at the municipal (town/city) level. If property taxes remain unpaid, the municipal tax collector will execute a tax lien on the property in the name of the municipality. This is not a sale of the lien to a third party, but rather the municipality securing its interest.",
      "If the property owner does not redeem the property from the municipality by paying all taxes, interest, and costs within two years from the execution of the lien, the tax collector then executes a tax deed, which conveys ownership of the property to the municipality. At this point, the former owner's right of redemption is terminated.",
      "Once the municipality owns the property, it can sell it at a public auction to the highest bidder to recover the delinquent taxes and costs. There is no post-sale redemption period for the former owner after this auction takes place.",
    ],
    resources: [
      { label: "New Hampshire Department of Revenue Administration", url: "https://www.revenue.nh.gov/" },
      { label: "New Hampshire General Court (Statutes)", url: "https://www.gencourt.state.nh.us/rsa/html/NHTOC.htm" },
    ],
  },
  NJ: {
    classification: "Tax Lien",
    governingStatutes: "New Jersey Statutes Annotated (N.J.S.A.) 54:5-19 et seq.",
    redemptionPeriod: "A private certificate holder generally may begin foreclosure after 2 years from the date of sale. Redemption continues until barred by judgment of the Superior Court. Municipal-held certificates can follow different assignment and foreclosure rules.",
    interestRate: "The statutory maximum is generally 18% per annum, subject to bid-down at auction. Redemption also includes allowable subsequent taxes, municipal liens, costs, and interest properly paid by the certificate holder.",
    overview: [
      "New Jersey is a Tax Lien state. Municipalities conduct tax sales to sell liens arising from unpaid real property taxes and municipal charges such as water, sewer, and assessments. The investor purchases a tax sale certificate, not the property itself. The certificate creates a statutory lien and gives the holder the right to receive the redemption amount if the owner or another interested party redeems.",
      "The sale is typically a bid-down interest auction. Bidding begins at the maximum statutory interest rate and moves downward as bidders accept a lower return. If the bidding reaches 0%, investors may bid a premium above the lien amount. Premiums are held by the municipality and are generally returned if the lien is redeemed or if the certificate holder later forecloses successfully; however, the premium itself does not create the same return profile as the certificate interest.",
      "The path from certificate to ownership is judicial. A private certificate holder generally must wait two years from the tax sale certificate date before filing a Superior Court action to foreclose the right of redemption. Even after the complaint is filed, redemption normally continues until it is barred by final judgment. This makes New Jersey a strong lien-return market, but a slower and more legal-intensive acquisition market.",
    ],
    resources: [
      { label: "New Jersey Division of Taxation", url: "https://www.state.nj.us/treasury/taxation/" },
      { label: "New Jersey Statutes, Title 54", url: "https://www.njleg.state.nj.us/" },
    ],
  },
  NM: {
    classification: "Tax Deed",
    governingStatutes: "New Mexico Statutes Annotated Chapter 7, Article 38 and related Property Tax Division rules",
    redemptionPeriod: "The owner may generally redeem before the tax sale by paying the delinquency, penalties, interest, and costs. There is no standard post-sale redemption period after a valid tax deed sale, although title challenges may be possible within applicable limitation periods.",
    interestRate: "Not applicable as an investor return. The purchaser is buying the property, not an interest-bearing certificate.",
    overview: [
      "New Mexico operates a centralized Tax Deed system through the Property Tax Division of the New Mexico Taxation and Revenue Department. Counties identify delinquent real property accounts, but the state Property Tax Division conducts delinquent property tax auctions and issues the deed to the successful purchaser.",
      "The auction sells the property itself rather than a certificate or lien. Sales are generally held at the county courthouse or another location designated by the Property Tax Division. Properties are sold subject to due diligence, and the purchaser should assume that title, access, environmental, zoning, utility, and occupancy issues require independent verification before bidding.",
      "New Mexico is attractive to acquisition-focused investors because there is no routine post-sale redemption period for the former owner. However, tax deeds may be challenged for statutory or notice defects. Investors should budget for title review and, when resale or financing is intended, potential quiet title or curative work.",
    ],
    resources: [
      { label: "New Mexico Taxation and Revenue Department - Delinquent Property Tax Auctions", url: "https://www.tax.newmexico.gov/businesses/property-tax-overview/delinquent-property-tax-auctions/" },
      { label: "New Mexico Statutes", url: "https://nmonesource.com/nmos/nmsa/en/nav.do" },
    ],
  },
  NY: {
    classification: "Hybrid (Tax Lien / Tax Deed)",
    governingStatutes: "New York Real Property Tax Law (RPTL), especially Article 11; local laws and charters for tax lien sales",
    redemptionPeriod: "Varies by enforcing unit. Under Article 11, redemption is generally available before expiration of the redemption period; the statute commonly references a period expiring two years after lien date unless otherwise modified by law.",
    interestRate: "Varies by county, city, or special lien-sale program. Investors must verify the local tax lien or foreclosure rules for the jurisdiction conducting the sale.",
    overview: [
      "New York is best treated as a hybrid state because the process varies significantly by county, city, and local charter. Many enforcing officers use Article 11 in-rem foreclosure procedures, which are more deed-oriented: delinquent taxes are enforced through a foreclosure proceeding, and after expiration of the redemption period and court process, title can transfer and the property may be sold. Other jurisdictions, most notably New York City historically and certain local governments by special law, use tax lien sales or tax lien trusts.",
      "For investors, the first question is not simply whether New York is a lien or deed state; it is which local enforcing unit controls the parcel. Some counties sell tax-foreclosed property at public auction after the foreclosure is complete. Others may use local lien sale structures or contract with auction vendors. Procedures, surplus treatment, bidder registration, and closing deadlines are highly local.",
      "Article 11 provides the backbone for redemption and foreclosure. Real property subject to a delinquent tax lien may be redeemed by payment before expiration of the redemption period. In many Article 11 cases, the redemption period runs two years after the lien date, but local law and special statutes can alter timing.",
    ],
    resources: [
      { label: "New York Senate - Real Property Tax Law Article 11", url: "https://www.nysenate.gov/legislation/laws/RPT/A11" },
      { label: "New York State Department of Taxation and Finance", url: "https://www.tax.ny.gov/" },
    ],
  },
  NC: {
    classification: "Tax Deed",
    governingStatutes: "North Carolina General Statutes Chapter 105 and Chapter 45 foreclosure procedures",
    redemptionPeriod: "The owner can redeem before confirmation by paying the delinquent taxes and authorized costs. After confirmation and delivery of the deed, there is generally no ordinary owner redemption right, but the sale can be challenged for procedural defects.",
    interestRate: "Not applicable as a certificate yield. The purchaser’s economics depend on the final bid and property outcome.",
    overview: [
      "North Carolina uses a tax foreclosure sale model rather than an investor tax lien certificate model. Counties and municipalities pursue delinquent real property taxes through mortgage-style foreclosure procedures or in rem proceedings. The property is sold at public auction, and the winning bidder is subject to the state’s upset bid process before the sale becomes final.",
      "The most important procedural feature is the 10-day upset bid period. After the auction, another bidder may file an upset bid with the Clerk of Superior Court by increasing the bid by the statutory amount and posting the required deposit. Each qualifying upset bid restarts a new 10-day period. Only after the upset bid period expires without another bid can the sale be confirmed and the purchaser proceed toward closing.",
      "For investors, North Carolina is acquisition-oriented, but it is not a same-day finality state. Capital must remain flexible until the upset period is exhausted. Due diligence should focus on title, occupancy, access, HOA obligations, municipal liens, and the exact county sale terms.",
    ],
    resources: [
      { label: "North Carolina General Assembly Statutes", url: "https://www.ncleg.gov/Laws/GeneralStatutes" },
      { label: "Mecklenburg County Tax Collector", url: "https://www.mecknc.gov/TaxCollections" },
    ],
  },
  ND: {
    classification: "Tax Deed",
    governingStatutes: "North Dakota Century Code Title 57, Chapters 57-28 and related provisions",
    redemptionPeriod: "The owner’s right to avoid loss generally occurs before the county obtains and sells the property. Once the county receives tax deed and the property is sold at the annual sale, there is no ordinary post-sale redemption by the former owner.",
    interestRate: "Not applicable as an investor lien yield in the county resale stage.",
    overview: [
      "North Dakota uses a Tax Deed foreclosure system in which counties acquire property after taxes remain unpaid through the statutory process. After foreclosure of the tax lien, the county auditor issues a tax deed to the county, and the county may then appraise and sell the property at an annual public sale.",
      "The annual sale of tax-deeded property is typically held at the county auditor’s office or the usual place of holding district court, beginning on the third Tuesday of November. Counties publish lists and minimum sale prices before the sale. The sale is therefore not a purchase of a tax lien certificate from a private investor perspective; it is the acquisition of county-held property after the owner’s redemption rights have effectively been cut off by the tax foreclosure process.",
      "Investors should treat North Dakota sales as asset purchases from a county, with strong attention to minimum bid, county sale terms, deed form, access, title insurability, and whether the parcel is buildable or burdened by special assessments.",
    ],
    resources: [
      { label: "North Dakota Century Code Title 57", url: "https://ndlegis.gov/cencode/t57.html" },
      { label: "North Dakota Association of Counties", url: "https://www.ndaco.org/" },
    ],
  },
  OH: {
    classification: "Hybrid (Tax Lien / Tax Deed)",
    governingStatutes: "Ohio Revised Code Chapter 5721",
    redemptionPeriod: "For tax certificates, the owner may redeem by paying the certificate redemption price before foreclosure proceeds to the point allowed by statute. For deed/foreclosure sales, redemption rights and finality depend on the foreclosure process and confirmation.",
    interestRate: "Tax certificate bidding may begin at up to 18% simple interest and bid down. Deed/foreclosure sales are not interest-return investments.",
    overview: [
      "Ohio is a hybrid state. County treasurers may sell tax certificates on delinquent parcels, and counties may also pursue tax foreclosure leading to sheriff’s sales or forfeited land sales. The investor experience depends on whether the county is offering tax lien certificates, foreclosure properties, or forfeited lands.",
      "Tax certificates are usually sold under a bid-down interest framework. At public auction, bidding can begin at 18% simple interest and move downward in quarter-percent increments. Some counties sell certificates in bulk or negotiated sales rather than parcel-by-parcel public bidding. The certificate holder receives a lien and may pursue statutory foreclosure if the owner does not redeem.",
      "Tax foreclosure and forfeited land sales are acquisition-oriented. These sales can transfer ownership after court process and confirmation, but investors should verify which liens survive, whether title insurance will require curative work, and whether possession issues exist.",
    ],
    resources: [
      { label: "Ohio Revised Code Chapter 5721", url: "https://codes.ohio.gov/ohio-revised-code/chapter-5721" },
      { label: "Franklin County Treasurer", url: "https://treasurer.franklincountyohio.gov/" },
    ],
  },
  OK: {
    classification: "Tax Deed",
    governingStatutes: "Oklahoma Statutes Title 68, Article 31",
    redemptionPeriod: "The owner or other interested party may redeem at any time before the start of the resale auction by paying the delinquent amount, interest, and costs. There is no standard post-resale redemption after a valid resale deed is issued, subject to limited protections and challenges.",
    interestRate: "Not applicable as an investor redemption return. The bidder is purchasing the property at resale.",
    overview: [
      "Oklahoma operates a county-administered Tax Deed resale system. When real property taxes remain unpaid for the statutory period, the county treasurer advertises the property and offers it at the annual resale. The resale is generally held on the second Monday of June each year in each county.",
      "The purchaser receives a resale deed from the county treasurer. Oklahoma is an acquisition-oriented state because the owner may redeem any time before the start of the resale auction, but there is no routine post-sale redemption after the resale deed is executed. That finality makes the pre-sale review of title, occupancy, access, and property condition especially important.",
      "Investors should also understand that Oklahoma resale deeds may still require title curative work. Many title companies and resale buyers prefer a quiet title action or other attorney review before resale, refinance, or title insurance. Counties commonly warn bidders that properties are sold as-is and that clear title is the purchaser’s responsibility.",
    ],
    resources: [
      { label: "Oklahoma Statutes Title 68", url: "https://oksenate.gov/sites/default/files/2019-12/os68.pdf" },
      { label: "Oklahoma County Treasurer", url: "https://www.oklahomacounty.org/elected-offices/treasurer" },
    ],
  },
  OR: {
    classification: "Redeemable Deed / Tax Foreclosure",
    governingStatutes: "Oregon Revised Statutes Chapter 312",
    redemptionPeriod: "Two years from the foreclosure judgment and decree, unless a statutory exception applies. Redemption occurs before the county takes final title.",
    interestRate: "Redemption includes interest on the judgment amount, commonly referenced at 9% per annum, plus applicable penalties, costs, and fees. This is paid to the county, not as a private certificate return.",
    overview: [
      "Oregon uses a county tax foreclosure process that functions like a redeemable deed system before the county takes final title. Real property can become subject to foreclosure after three years of delinquency. Once the circuit court enters judgment and decree of foreclosure, a two-year redemption period begins.",
      "During the redemption period, the owner or other authorized party can redeem by paying the judgment amount, interest, penalties, and costs. If the property is not redeemed by the end of the period, the county obtains title. After the county takes title, it may retain, transfer, or sell the property, often through a real property auction.",
      "From an investor perspective, Oregon is usually not a tax lien certificate state. The investor generally buys county-owned tax-foreclosed property after the redemption period has expired. The key diligence issues are county sale terms, deed form, surplus rules, environmental conditions, land use, access, and title insurability.",
    ],
    resources: [
      { label: "Oregon Revised Statutes Chapter 312", url: "https://www.oregonlegislature.gov/bills_laws/ors/ors312.html" },
      { label: "Oregon Department of Revenue - Property Tax", url: "https://www.oregon.gov/dor/programs/property/" },
    ],
  },
  PA: {
    classification: "Tax Deed",
    governingStatutes: "Real Estate Tax Sale Law, 72 P.S. § 5860. et seq.; Municipal Claims and Tax Liens Act for certain cities",
    redemptionPeriod: "Generally, redemption must occur before a valid Upset Sale; there is no ordinary post-sale redemption after a valid Upset Sale under the Real Estate Tax Sale Law. Local city procedures and special property types may vary.",
    interestRate: "Not applicable as an investor certificate return. The purchaser is acquiring property through a tax sale process.",
    overview: [
      "Pennsylvania is a Tax Deed state with a multi-stage county tax claim bureau process in most counties. The standard progression is an Upset Sale, followed by a Judicial Sale if the property does not sell, and then placement in a Repository for unsold properties. Philadelphia and certain other localities use distinct sheriff-sale or municipal-claim procedures.",
      "At an Upset Sale, the property is sold subject to any liens and encumbrances that are not discharged by the sale. Judicial Sales are designed to sell property free and clear of many liens after court approval and additional notice. Repository sales can offer deeply discounted opportunities but require careful review because properties often failed to sell at prior stages.",
      "Pennsylvania has no ordinary post-sale redemption after a valid Upset Sale under the Real Estate Tax Sale Law. The former owner’s primary post-sale remedy is to challenge confirmation or attack the sale based on defects such as notice deficiencies. Investors should not assume an upset-sale purchase produces immediately marketable title without reviewing surviving liens and county terms.",
    ],
    resources: [
      { label: "Pennsylvania General Assembly - Real Estate Tax Sale Law", url: "https://www.legis.state.pa.us/" },
      { label: "Philadelphia Sheriff Real Estate Sales", url: "https://phillysheriff.com/real-estate/" },
    ],
  },
  RI: {
    classification: "Redeemable Deed",
    governingStatutes: "Rhode Island General Laws Title 44, Chapter 9",
    redemptionPeriod: "The owner and other interested parties may redeem before the right of redemption is foreclosed. The purchaser generally waits at least one year from the sale before seeking to foreclose redemption rights.",
    interestRate: "Redemption commonly includes the purchase amount, intervening taxes and costs, a statutory penalty, and interest at 1% per month after the initial period, depending on the stage and statutory calculation.",
    overview: [
      "Rhode Island uses a municipal tax sale system that functions as a Redeemable Deed or tax title process. Cities and towns sell tax titles when property taxes are delinquent. The purchaser receives a tax title interest, but the former owner and other interested parties retain redemption rights until those rights are foreclosed through the statutory process.",
      "The purchaser does not ordinarily gain immediate possession or full practical ownership merely by winning the sale. After the required waiting period, the purchaser may petition the Superior Court to foreclose the right of redemption. Interested parties who want to preserve their rights must redeem by paying the statutory amount before the court bars redemption.",
      "The investor return is built around a penalty and monthly interest. Rhode Island can produce attractive yields on redemption, but it is legal-process intensive. Investors must budget for notices, attorney involvement, and court filings to convert a tax title into marketable ownership.",
    ],
    resources: [
      { label: "Rhode Island General Laws Title 44, Chapter 9", url: "http://webserver.rilin.state.ri.us/Statutes/TITLE44/44-9/INDEX.htm" },
      { label: "City of Providence Tax Collector", url: "https://www.providenceri.gov/collector/" },
    ],
  },
  SC: {
    classification: "Redeemable Deed",
    governingStatutes: "South Carolina Code of Laws Title 12, Chapter 51",
    redemptionPeriod: "One year from the date of the tax sale. If not redeemed, the tax collector may issue a tax deed after statutory notice requirements are satisfied.",
    interestRate: "Tiered redemption premium commonly calculated at 3%, 6%, 9%, and 12% depending on the quarter of redemption, subject to statutory limits and county calculation rules.",
    overview: [
      "South Carolina uses a county-administered Redeemable Deed system. Delinquent tax collectors sell properties at public auction, and the winning bidder receives a tax sale receipt rather than immediately marketable title. The defaulting taxpayer and other entitled parties have a one-year redemption period.",
      "The investor’s return depends on how long the property remains unredeemed. South Carolina uses a tiered interest/premium structure based on the time of redemption: 3%, 6%, 9%, and 12% increments are commonly referenced by counties. The premium is calculated on the bid amount, but statutory limits and county practices should be verified before bidding.",
      "If the property is not redeemed within the one-year period and required notices are properly completed, the tax collector issues a tax deed to the successful bidder. Investors should still evaluate title insurability, HOA liens, municipal code issues, occupancy, access, and whether the bid exceeds what can realistically be recovered on redemption.",
    ],
    resources: [
      { label: "South Carolina Code Title 12, Chapter 51", url: "https://www.scstatehouse.gov/code/t12c051.php" },
      { label: "Greenville County Tax Sale FAQ", url: "https://www.greenvillecounty.org/TaxCollector/TaxSaleFAQ.aspx" },
    ],
  },
  SD: {
    classification: "Tax Lien",
    governingStatutes: "South Dakota Codified Laws Title 10, Chapters 23 and 24",
    redemptionPeriod: "The property may be redeemed at any time before the tax deed is issued. In ordinary cases, the certificate holder cannot obtain a deed until the statutory waiting period has run, commonly three years, with some circumstances extending the timeline.",
    interestRate: "The statutory return is commonly 10% per annum on the certificate amount and eligible subsequent payments, subject to current county and statutory calculations.",
    overview: [
      "South Dakota is a Tax Lien certificate state. County treasurers offer tax certificates for delinquent real property taxes. The certificate holder pays the delinquent taxes and receives a lien position, not ownership or possession of the property.",
      "The owner or other authorized party may redeem the certificate before a tax deed is issued by paying the statutory redemption amount to the county treasurer. The purchaser’s return is generated from statutory interest and reimbursement of amounts paid. If the certificate remains unredeemed for the required period, the holder may proceed through statutory notice requirements to obtain a tax deed.",
      "South Dakota is therefore more suitable for investors seeking lien returns than immediate acquisition. The tax deed path requires patience, proper statutory notices, and careful title review before treating the property as an owned asset.",
    ],
    resources: [
      { label: "South Dakota Legislature - Title 10", url: "https://sdlegislature.gov/Statutes/10" },
      { label: "South Dakota Department of Revenue - County Treasurers", url: "https://dor.sd.gov/government/county-treasurers/" },
    ],
  },
  TN: {
    classification: "Redeemable Deed",
    governingStatutes: "Tennessee Code Annotated Title 67, Chapter 5, Parts 24-27",
    redemptionPeriod: "Generally 1 year, 180 days, or 90 days from the order confirming sale depending on the length of delinquency. The longest common period applies when the delinquency is five years or less.",
    interestRate: "Redemption generally requires payment of the bid plus statutory interest, commonly 12% per annum, together with allowed costs and taxes.",
    overview: [
      "Tennessee uses a court-supervised delinquent tax sale process that functions as a Redeemable Deed system. Delinquent tax suits are filed in court, and properties are sold to satisfy taxes, penalties, interest, and costs. The sale must be confirmed by the court, and redemption periods run from the order confirming the sale.",
      "Tennessee’s redemption period is now tiered based on the age of the delinquency. If the period of delinquency is five years or less, the redemption period is generally one year. If the delinquency is more than five years but less than eight years, it is generally 180 days. If eight years or more, it is generally 90 days. Federal liens, local rules, and court orders can affect the practical timeline.",
      "For investors, Tennessee offers a path to acquisition with a potentially high statutory return if redeemed. However, because it is judicial and redemption-based, a bidder must budget for court confirmation, possible redemption, possession issues, and title curative work.",
    ],
    resources: [
      { label: "Tennessee Code Annotated Title 67", url: "https://law.justia.com/codes/tennessee/title-67/" },
      { label: "Tennessee County Technical Assistance Service - Redemption", url: "https://www.ctas.tennessee.edu/eli/redemption" },
    ],
  },
  TX: {
    classification: "Tax Deed",
    governingStatutes: "Texas Tax Code Chapter 34",
    redemptionPeriod: "Generally 180 days for most non-homestead/non-agricultural real property; generally 2 years for residence homestead, agricultural-use property, and mineral interests.",
    interestRate: "Texas uses redemption premiums rather than simple interest: generally 25% during the first year/first redemption period, and 50% during the second year for two-year redemption properties.",
    overview: [
      "Texas uses a judicial tax foreclosure sale system that results in a sheriff or constable deed to the purchaser. The property is sold at public auction to satisfy delinquent ad valorem taxes. Unlike pure deed states with no redemption, Texas retains a powerful post-sale redemption right for certain property types.",
      "For homestead property, agricultural-use property, and mineral interests, the former owner generally has two years from the filing of the purchaser’s deed to redeem. For most other real property, the redemption period is generally 180 days. The redemption amount includes the purchase price plus a significant statutory premium, with a higher premium in the second year for properties with a two-year redemption period.",
      "Texas can produce strong acquisition opportunities, but possession and exit strategy must account for redemption risk. Bidders should identify property type before bidding, because a six-month redemption and two-year redemption produce very different capital timelines and risk profiles.",
    ],
    resources: [
      { label: "Texas Tax Code Chapter 34", url: "https://statutes.capitol.texas.gov/Docs/TX/htm/TX.34.htm" },
      { label: "Harris County Tax Sales", url: "https://www.hctax.net/Property/TaxSales" },
    ],
  },
  UT: {
    classification: "Tax Deed",
    governingStatutes: "Utah Code Title 59, Chapter 2, Part 13",
    redemptionPeriod: "The owner may redeem before the tax sale by paying the full delinquent amount and costs. There is no ordinary post-sale redemption after a valid final tax sale.",
    interestRate: "Not applicable as an investor return. The purchaser buys the property at tax sale.",
    overview: [
      "Utah is a Tax Deed state. County auditors conduct an annual final tax sale of properties that have remained delinquent long enough to become subject to sale. After the statutory delinquency period, the county gives notice and offers the property at auction to recover taxes, penalties, interest, and administrative costs.",
      "The owner’s redemption right exists before the sale. Utah counties commonly state that property may be redeemed up to a specified time on the sale date, often 10:00 a.m., by paying all taxes, interest, penalties, and administrative fees. After the sale is completed, the transaction is generally final, subject to statutory protest or challenge procedures.",
      "This makes Utah an acquisition-focused state with comparatively clean sale finality. Investors must still investigate title, access, zoning, water rights, environmental conditions, and whether parcels are buildable or landlocked. Many Utah tax sale offerings are vacant land or unusual parcels, so GIS and land-use research are especially important.",
    ],
    resources: [
      { label: "Utah Code Title 59, Chapter 2", url: "https://le.utah.gov/xcode/Title59/Chapter2/59-2.html" },
      { label: "Salt Lake County Property Tax Sale", url: "https://www.saltlakecounty.gov/property-tax/property-tax-sale/" },
    ],
  },
  VT: {
    classification: "Redeemable Deed",
    governingStatutes: "Vermont Statutes Annotated Title 32, Chapter 133",
    redemptionPeriod: "Generally 1 year from the date of tax sale, subject to statutory notice and any special rules.",
    interestRate: "The redemption amount includes the bid amount plus statutory interest, commonly described as 1% per month or 12% annualized on the high bid, plus allowable costs.",
    overview: [
      "Vermont uses a municipal tax sale process that functions as a Redeemable Deed system. Town tax collectors can sell property for delinquent taxes after statutory notice and warrant procedures. The winning bidder receives rights subject to the owner’s statutory redemption period.",
      "The owner, mortgagee, or other entitled party generally has a one-year redemption period from the date of sale. If the property is redeemed, the purchaser receives the redemption amount rather than title. If not redeemed, the collector’s deed can transfer the property after statutory requirements are met.",
      "Vermont’s process is highly local and municipal. Investors should verify town-level notices, minimum debt thresholds, sale terms, deed form, and any local practice. Because Vermont parcels may involve septic, well, access, zoning, or environmental restrictions, property-level research is critical.",
    ],
    resources: [
      { label: "Vermont Statutes Online - Title 32, Chapter 133", url: "https://legislature.vermont.gov/statutes/chapter/32/133" },
      { label: "Vermont Department of Taxes", url: "https://tax.vermont.gov/" },
    ],
  },
  VA: {
    classification: "Tax Deed",
    governingStatutes: "Code of Virginia Title 58.1, Chapter 39, Article 4",
    redemptionPeriod: "The owner or interested party may redeem prior to the date of sale by paying all accumulated taxes, penalties, interest, attorney fees, and costs. No ordinary post-sale redemption exists after a valid confirmed sale.",
    interestRate: "Not applicable as a certificate yield. The purchaser buys the property through a judicial or nonjudicial sale.",
    overview: [
      "Virginia uses a tax delinquent real estate sale process that can be judicial or, for qualifying properties, nonjudicial. Localities or their attorneys bring delinquent parcels to sale after statutory prerequisites are satisfied. The sale transfers property to the successful bidder after court confirmation or completion of the required nonjudicial process.",
      "The owner may redeem before the sale by paying all accumulated taxes, penalties, interest, costs, and authorized attorney fees. Partial payments generally do not stop the sale unless the locality accepts a statutory or contractual payment arrangement. After a valid sale and confirmation, the former owner does not ordinarily have a post-sale redemption right.",
      "Virginia is acquisition-oriented, but the process is litigation-driven in many counties and cities. Investors should review the terms of sale, commissioner or special master requirements, deposit rules, closing deadlines, title exceptions, occupancy, and whether the locality or auction vendor provides any warranty.",
    ],
    resources: [
      { label: "Code of Virginia § 58.1-3965", url: "https://law.lis.virginia.gov/vacode/title58.1/chapter39/section58.1-3965/" },
      { label: "Code of Virginia § 58.1-3975", url: "https://law.lis.virginia.gov/vacode/title58.1/chapter39/section58.1-3975/" },
    ],
  },
  WA: {
    classification: "Tax Deed",
    governingStatutes: "Revised Code of Washington (RCW) Chapter 84.",
    redemptionPeriod: "Redemption generally occurs before the tax foreclosure sale, commonly no later than the day before the sale. There is no ordinary post-sale redemption after a valid tax foreclosure sale.",
    interestRate: "Not applicable as a private certificate return. The purchaser buys the property at foreclosure sale.",
    overview: [
      "Washington uses a county tax foreclosure system. After the statutory delinquency period, the county treasurer issues a certificate of delinquency and proceeds through foreclosure. Following judgment, properties are sold at public auction, often online, to recover delinquent taxes, interest, penalties, and costs.",
      "The owner and parties with recorded interests generally may redeem or pay the delinquency before the sale, often up to the close of business on the day before auction. After the tax foreclosure sale is completed, there is generally no standard post-sale redemption for the former owner.",
      "Washington tax foreclosure sales can be attractive for acquisition, but bidders must pay close attention to county-specific sale terms, title exceptions, occupancy, environmental issues, utilities, and whether surplus proceeds are handled by the county. Many counties use third-party auction platforms and require strict registration and payment deadlines.",
    ],
    resources: [
      { label: "RCW Chapter 84.", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=84.64" },
      { label: "Washington Department of Revenue - Property Tax", url: "https://dor.wa.gov/taxes-rates/property-tax" },
    ],
  },
  WV: {
    classification: "Hybrid (Tax Lien followed by Tax Deed)",
    governingStatutes: "West Virginia Code Chapter 11A",
    redemptionPeriod: "Generally 18 months after the tax lien sale, subject to statutory notices and the specific stage of the Auditor/Deputy Commissioner process.",
    interestRate: "Redemption generally includes the purchase amount and subsequent charges, with statutory interest commonly described as 12% per annum or 1% per month on eligible amounts, plus allowable costs.",
    overview: [
      "West Virginia operates a hybrid system that begins with county sheriff tax lien sales and can end with a tax deed issued through the State Auditor process. County sheriffs sell tax liens for delinquent real estate taxes. The purchaser receives a lien, not immediate ownership.",
      "After the lien sale, the owner and other entitled parties have an 18-month redemption window. If the lien is not redeemed, the purchaser must comply with notice-to-redeem procedures and may request a deed through the appropriate state process. If the original lien purchaser does not complete the deed process, the property may move through Auditor and Deputy Commissioner sales.",
      "West Virginia can be a high-yield lien market, but acquisition requires precision. The notice requirements are strict, and failure to complete them properly can jeopardize the path to deed. Investors should track deadlines, service costs, title examinations, and statutory reimbursement limits.",
    ],
    resources: [
      { label: "West Virginia Code Chapter 11A", url: "https://code.wvlegislature.gov/11A/" },
      { label: "West Virginia State Auditor - County Collections", url: "https://www.wvsao.gov/CountyCollections/Default" },
    ],
  },
  WI: {
    classification: "Tax Deed",
    governingStatutes: "Wisconsin Statutes Chapter 75",
    redemptionPeriod: "Redemption occurs before the county completes tax deed or in-rem foreclosure. Counties commonly provide at least an 8-week redemption period after publication of the foreclosure action, depending on the statutory route.",
    interestRate: "Not applicable as a private certificate return. Purchasers typically buy county-owned tax-deeded property after foreclosure.",
    overview: [
      "Wisconsin uses county-held tax certificates and tax deed foreclosure procedures rather than a broad investor tax lien certificate market. Counties take tax certificates for unpaid property taxes and may later pursue tax deed or in-rem foreclosure to acquire title. After the county owns the property, it may sell tax-deeded lands under county board procedures.",
      "The owner or interested party has a redemption opportunity during the county’s foreclosure process. Counties commonly describe a redemption period of at least eight weeks after the in-rem foreclosure action is first published, though the precise procedural timeline depends on Chapter 75 and county practice. Redemption requires payment of delinquent taxes, special assessments, interest, penalties, and costs.",
      "For investors, Wisconsin opportunities are usually county-owned tax-deeded land sales, not private lien purchases. Due diligence should focus on county sale terms, deed type, condition, title insurance requirements, zoning, shoreland or wetland restrictions, and whether the property was previously rejected by the market.",
    ],
    resources: [
      { label: "Wisconsin Statutes Chapter 75", url: "https://docs.legis.wisconsin.gov/statutes/statutes/75" },
      { label: "Milwaukee County Treasurer", url: "https://county.milwaukee.gov/EN/Treasurer" },
    ],
  },
  WY: {
    classification: "Tax Lien",
    governingStatutes: "Wyoming Statutes Title 39, especially § 39-13-108",
    redemptionPeriod: "Generally 4 years from the date of the tax sale. After that period, the certificate holder may apply for a tax deed if statutory notices are properly completed; deed application deadlines also apply.",
    interestRate: "Statutory return commonly includes a 3% penalty and 15% per annum interest on eligible principal amounts, plus interest on subsequent taxes paid by the certificate holder.",
    overview: [
      "Wyoming is a Tax Lien state. County treasurers conduct tax sales for delinquent property taxes, and the purchaser receives a Certificate of Purchase. The certificate holder does not receive ownership, possession, or the right to improve the property during the redemption period.",
      "Wyoming is notable for its long redemption period and attractive statutory return. The property owner or mortgagee may redeem within four years from the date of the tax sale. If the property is not redeemed, the certificate holder may apply for a tax deed only after the four-year period and after strictly complying with statutory notice requirements. A deed generally cannot be issued after the certificate’s statutory life expires, commonly six years from sale.",
      "The investor thesis is primarily lien-yield oriented, with property acquisition as a secondary possibility. Proper tracking of redemption deadlines, subsequent taxes, notices, and deed application windows is essential. Investors should not assume access, possession, or control until a valid tax deed is issued.",
    ],
    resources: [
      { label: "Wyoming Statutes Title 39", url: "https://wyoleg.gov/statutes/compress/title39.pdf" },
      { label: "Laramie County Tax Sale", url: "https://www.laramiecountywy.gov/County-Government/Elected-Officials/County-Treasurer/Tax-Sale" },
    ],
  },
};

if (typeof module !== "undefined") module.exports = { STATE_DOC_SOURCE, STATE_DOC_SUMMARY, STATE_DOC_DETAIL };
