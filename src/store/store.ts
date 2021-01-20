import { makeAutoObservable } from 'mobx';
import * as data from '../data.json';

interface IPaginator {
  currentSection: string;
  changeSection(section: string): void;
  sections: string[];
  content: { title: string; text: string }[];
}

class Paginator implements IPaginator {
  currentSection: string = data.sections[0];
  sections = data.sections;
  content = data.content;

  constructor() {
    // Avoid duplicates
    // They are generally bad for the design, but also section values used as keys in sections list
    this.sections = [...new Set(this.sections)];

    // Create unique id for each content item
    this.content = this.content.map((item, index) => ({
      ...item,
      id: index.toString(),
    }));
    makeAutoObservable(this);
  }

  changeSection(section: string): void {
    this.currentSection = section;
  }
}

export default new Paginator();
