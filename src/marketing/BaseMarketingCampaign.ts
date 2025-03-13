export default abstract class BaseMarketingCampaign {

    private campaignName: string;
    
    public constructor({campaignName}: {campaignName: string}) {
        this.campaignName = campaignName;
    }

    protected getCampaignName() {
        return this.campaignName;
    }

    protected getFromLocalStorage(key: string) {
        key = "casino2zipette:marketing:"+this.getCampaignName()+":"+key;
        return localStorage.getItem(key);
    }

    protected setInLocalStorage(key: string, value: string) {
        key = "casino2zipette:marketing:"+this.getCampaignName()+":"+key;
        localStorage.setItem(key, value);
    }

    public abstract getHomeComponent(): any;
    
}