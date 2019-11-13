import PrevNext from 'app/items/rest/prevnext';

export default class Related extends PrevNext {
  readonly excerpt: string;
  readonly date: Date;
  readonly meta: {
    [key: string]: string | boolean;
  };
  readonly thumbnail: {
    [key: string]: string;
  };

  constructor(data) {
    super(data);

    this.excerpt = decodeURIComponent(data.excerpt);

    const date = data.date.split(' ');
    this.date = new Date(date[0]);
    this.meta = this.parseMeta(data.meta);
    this.thumbnail = data.thumbnail;
  }

  public parseDate(): { [key: string]: string | number } {
    return {
      day: this.date.getDate(),
      month: this.date.toLocaleString('en-us', { month: 'short' }),
      year: this.date.getFullYear(),
    };
  }

  public getImage(): void {
    console.log('getImage');
  }

  private parseMeta(meta: string): { [key: string]: string } {
    const newMeta = {};

    Object.keys(meta).forEach((mataKey) => {
      const mataValue = meta[mataKey];
      if (typeof mataValue !== 'string') {
        newMeta[mataKey] = mataValue;
      }

      try {
        newMeta[mataKey] = JSON.parse(mataValue) || mataValue;
      } catch (e) {
        newMeta[mataKey] = mataValue;
      }
    });

    return newMeta;
  }
}
