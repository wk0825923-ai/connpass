/**
 * EventStore: シンプルなモジュールスコープの共有状態
 * dashboard で取得したイベント/投稿を editor・status へ引き継ぐ。
 * バックエンド接続後は Zustand or React Context に置き換え。
 * ※ page.tsx から任意の named export はできない（App Router制約）ため、
 *   共有ステートはこのモジュールに集約する。
 */
import type { ConnpassEvent, ScheduledPost } from './types';

export let sharedEvent: ConnpassEvent | null = null;
export let sharedPosts: ScheduledPost[] = [];

export const setSharedEvent = (e: ConnpassEvent) => { sharedEvent = e; };
export const setSharedPosts = (p: ScheduledPost[]) => { sharedPosts = p; };
