#!/usr/bin/env node

const { execSync } = require('child_process');
const depcheck = require('depcheck');
const fs = require('fs');

const options = {
  ignorePatterns: ['@babel/*', 'react-native'], // bỏ qua các native module cơ bản
  skipMissing: false,
};

const nativeModules = [
  'react-native-gesture-handler',
  'react-native-reanimated',
  'react-native-paper',
  'react-native-vector-icons',
  'react-native-web',
];

console.log('🔎 Kiểm tra dependencies...');

depcheck(process.cwd(), options, (unused) => {
  console.log('\n✅ Unused dependencies (JS có thể remove):');
  const removableDeps = unused.dependencies.filter((d) => !nativeModules.includes(d));
  removableDeps.forEach((dep) => console.log(`  - ${dep}`));

  // Xóa unused dependencies
  if (removableDeps.length > 0) {
    console.log('\n🗑 Xóa các package unused...');
    execSync(`yarn remove ${removableDeps.join(' ')}`, { stdio: 'inherit' });
  }

  console.log('\n✅ Unused devDependencies:');
  unused.devDependencies.forEach((dep) => console.log(`  - ${dep}`));

  // Xóa depcheck sau khi dùng
  if (unused.devDependencies.includes('depcheck')) {
    console.log('\n🗑 Xóa depcheck devDependency...');
    execSync('yarn remove --dev depcheck', { stdio: 'inherit' });
  }

  console.log('\n⚠️ Missing dependencies:');
  unused.missing.forEach((dep) => console.log(`  - ${dep}`));

  // Cài missing dependencies
  const missingDeps = Object.keys(unused.missing);
  if (missingDeps.length > 0) {
    console.log('\n📦 Cài các missing dependencies...');
    execSync(`yarn add ${missingDeps.join(' ')}`, { stdio: 'inherit' });
  }

  console.log('\n🎉 Kiểm tra và cleanup dependencies hoàn tất!');
});
